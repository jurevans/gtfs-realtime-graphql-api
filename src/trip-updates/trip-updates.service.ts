import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TripUpdate } from 'proto/gtfs-realtime';
import { TripUpdateEntity } from 'entities/trip-update.entity';
import { FeedService } from 'feed/feed.service';
import {
  filterTripEntitiesByRouteIds,
  getGTFSConfigByFeedIndex,
  getUrlsByRouteIds,
} from 'util/';
import { EntityTypes } from 'constants/';
import { FilterTripUpdatesArgs } from 'trip-updates/filter-trip-updates.args';
import { GetTripUpdatesArgs } from 'trip-updates/trip-updates.args';

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

    const config = getGTFSConfigByFeedIndex(this.configService, feedIndex);

    if (!config) {
      throw new HttpException(
        `No valid configuration found for feedIndex: ${feedIndex}!`,
        500,
      );
    }

    const { feedUrls } = config;
    const urls = getUrlsByRouteIds(feedUrls, routeIds);

    const entities = await this.feedService.getFeedMessages<
      TripUpdateEntity,
      TripUpdate
    >({
      feedIndex,
      urls,
      entity: TripUpdateEntity,
      type: EntityTypes.TRIP_UPDATE,
    });

    if (routeIds.length > 0) {
      return filterTripEntitiesByRouteIds<TripUpdateEntity>(entities, routeIds);
    }
    return <TripUpdateEntity[]>entities;
  }
}
