import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { IConfig } from 'interfaces/config.interface';
import { FeedMessages } from 'feed/feed-messages.context';
import { VehiclePositionsStrategy } from 'feed/strategies/vehicle-positions.strategy';

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

    const config: IConfig = getGTFSConfigByFeedIndex(
      this.configService,
      feedIndex,
    );

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

    const entities = new FeedMessages<VehiclePositionEntity>(
      new VehiclePositionsStrategy(),
    ).getEntities(feedMessages);

    if (routeIds.length > 0) {
      return filterTripEntitiesByRouteIds<VehiclePositionEntity>(
        entities,
        routeIds,
      );
    }

    return entities;
  }
}
