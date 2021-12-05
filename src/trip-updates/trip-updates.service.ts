import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TripUpdateEntity } from 'entities/trip-update.entity';
import { FeedService } from 'feed/feed.service';
import {
  filterTripEntitiesByRouteIds,
  getEndpointsByRouteIds,
  getGTFSConfigByFeedIndex,
  getUrlsByType,
} from 'util/';
import { EntityTypes } from 'constants/';
import { FilterTripUpdatesArgs } from 'trip-updates/filter-trip-updates.args';
import { GetTripUpdatesArgs } from 'trip-updates/trip-updates.args';
import { IEndpoint } from 'interfaces/endpoint.interface';
import { IConfig } from 'interfaces/config.interface';
import { FeedMessages } from 'feed/feed-messages.context';
import { TripUpdatesStrategy } from 'feed/strategies/trip-updates.strategy';

@Injectable()
export class TripUpdatesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly feedService: FeedService,
  ) {}

  public async getTripUpdates(
    args: GetTripUpdatesArgs,
    filter: FilterTripUpdatesArgs,
  ) {
    const { feedIndex } = args;
    const { routeIds } = filter;

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

    const urls = getUrlsByType(useEndpoints, EntityTypes.TRIP_UPDATE);

    const feedMessages = await this.feedService.getFeedMessages({
      feedIndex,
      urls,
    });

    const entities = new FeedMessages<TripUpdateEntity>(
      new TripUpdatesStrategy(),
    ).getEntities(feedMessages);

    if (routeIds.length > 0) {
      return filterTripEntitiesByRouteIds<TripUpdateEntity>(entities, routeIds);
    }

    return entities;
  }
}
