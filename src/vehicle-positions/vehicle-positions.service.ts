import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VehiclePositionEntity } from 'entities/vehicle-position.entity';
import { FeedEntity } from 'proto/gtfs-realtime';
import { FeedService } from 'feed/feed.service';
import {
  GetVehiclePositionsArgs,
  FilterVehiclePositionsArgs,
} from 'vehicle-positions/vehicle-positions.args';
import { IEndpoint } from 'interfaces/endpoint.interface';
import {
  filterTripEntitiesByRouteIds,
  getGTFSConfigByFeedIndex,
  getEndpointsByRouteIds,
  getUrlsByType,
  getFeedEntitiesByType,
} from 'util/';
import { EntityTypes } from 'constants/';

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

    const { endpoints } = config;
    const useEndpoints: IEndpoint[] = [];

    if (routeIds.length > 0) {
      useEndpoints.push(...getEndpointsByRouteIds(endpoints, routeIds));
    } else {
      useEndpoints.push(...endpoints);
    }

    const urls = getUrlsByType(useEndpoints, EntityTypes.VEHICLE_POSITION);
    const feedMessages = await this.feedService.getFeedMessages({
      feedIndex,
      urls,
    });

    const entities = getFeedEntitiesByType(
      feedMessages,
      EntityTypes.VEHICLE_POSITION,
    ).map(
      (feedEntity: FeedEntity) =>
        new VehiclePositionEntity(feedEntity[EntityTypes.VEHICLE_POSITION]),
    );

    if (routeIds.length > 0) {
      return filterTripEntitiesByRouteIds<VehiclePositionEntity>(
        entities,
        routeIds,
      );
    }

    return entities;
  }
}
