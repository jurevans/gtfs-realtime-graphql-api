import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VehiclePosition } from 'proto/gtfs-realtime';
import { VehiclePositionEntity } from 'entities/vehicle-position.entity';
import { FeedService } from 'feed/feed.service';
import {
  filterTripEntitiesByRouteIds,
  getGTFSConfigByFeedIndex,
  getEndpointsByRouteIds,
  getUrlsByType,
} from 'util/';
import { EntityTypes } from 'constants/';
import { GetVehiclePositionsArgs } from './vehicle-positions.args';
import { FilterVehiclePositionsArgs } from 'vehicle-positions/filter-vehicle-positions.args';
import { IEndpoint } from 'interfaces/endpoint.interface';

@Injectable()
export class VehiclePositionsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly feedService: FeedService,
  ) {}

  async getVehiclePositions(
    args: GetVehiclePositionsArgs,
    filter: FilterVehiclePositionsArgs,
  ) {
    const { feedIndex } = args;
    const { routeIds = [] } = filter;

    const config = getGTFSConfigByFeedIndex(this.configService, feedIndex);

    if (!config) {
      throw new HttpException(
        `No valid configuration found for feedIndex: ${feedIndex}!`,
        500,
      );
    }

    const { feedUrls } = config;
    const endpoints: IEndpoint[] = [];

    if (routeIds.length > 0) {
      endpoints.push(...getEndpointsByRouteIds(feedUrls, routeIds));
    } else {
      endpoints.push(...feedUrls);
    }

    const urls = getUrlsByType(endpoints, EntityTypes.VEHICLE_POSITION);
    const entities = await this.feedService.getFeedMessages<
      VehiclePositionEntity,
      VehiclePosition
    >({
      feedIndex,
      urls,
      entity: VehiclePositionEntity,
      type: EntityTypes.VEHICLE_POSITION,
    });

    if (routeIds.length > 0) {
      return filterTripEntitiesByRouteIds<VehiclePositionEntity>(
        entities,
        routeIds,
      );
    }

    return <VehiclePositionEntity[]>entities;
  }
}
