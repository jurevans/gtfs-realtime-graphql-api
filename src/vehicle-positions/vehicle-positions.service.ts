import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VehiclePosition } from 'proto/gtfs-realtime';
import { VehiclePositionEntity } from 'entities/vehicle-position.entity';
import { FeedService } from 'feed/feed.service';
import {
  filterTripEntitiesByRouteIds,
  getConfigByFeedIndex,
  getUrlsByRouteIds,
} from 'util/';
import { EntityTypes } from 'constants/';
import { GetVehiclePositionsArgs } from 'vehicle-positions/vehicle-positions.args';
import { RouteFilterArgs } from 'args/route-filter.args';

@Injectable()
export class VehiclePositionsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly feedService: FeedService,
  ) {}

  async getVehiclePositions(
    args: GetVehiclePositionsArgs,
    filter: RouteFilterArgs,
  ) {
    const { feedIndex } = args;
    const { routeIds } = filter;

    const config = getConfigByFeedIndex(
      this.configService,
      'gtfs-realtime',
      feedIndex,
    );

    if (!config) {
      throw new HttpException(
        `No valid configuration found for feedIndex: ${feedIndex}!`,
        500,
      );
    }

    const { feedUrls } = config;
    const urls = getUrlsByRouteIds(feedUrls, routeIds);

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
