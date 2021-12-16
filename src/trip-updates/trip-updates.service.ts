import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TripUpdateEntity } from 'entities/trip-update.entity';
import { StopTimeUpdateEntity } from 'entities/stop-time-update.entity';
import { FeedService } from 'feed/feed.service';
import {
  GetTripUpdatesArgs,
  FilterTripUpdatesArgs,
} from 'trip-updates/trip-updates.args';
import { IEndpoint } from 'interfaces/endpoint.interface';
import { FeedMessages } from 'feed/feed-messages.context';
import {
  filterTripEntitiesByRouteIds,
  getEndpointsByRouteIds,
  getFeedEntitiesByType,
  getGTFSConfigByFeedIndex,
  getUrlsByType,
} from 'util/';
import { EntityTypes } from 'constants/';
import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';

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
    const { routeIds, stopIds } = filter;

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

    const urls = getUrlsByType(useEndpoints, EntityTypes.TRIP_UPDATE);

    const feedMessages = await this.feedService.getFeedMessages({
      feedIndex,
      urls,
    });

    let entities = new FeedMessages<TripUpdateEntity>((feeds: FeedMessage[]) =>
      getFeedEntitiesByType(feeds, EntityTypes.TRIP_UPDATE).map(
        (feedEntity: FeedEntity) =>
          new TripUpdateEntity(feedEntity[EntityTypes.TRIP_UPDATE]),
      ),
    ).getEntities(feedMessages);

    if (stopIds.length > 0) {
      entities = entities
        .map((tripUpdate: TripUpdateEntity) => ({
          ...tripUpdate,
          stopTimeUpdate: tripUpdate.stopTimeUpdate.filter(
            (stUpdate: StopTimeUpdateEntity) =>
              stopIds.indexOf(stUpdate.stopId) > -1,
          ),
        }))
        .filter(
          (tripUpdate: TripUpdateEntity) =>
            tripUpdate.stopTimeUpdate.length > 0,
        );
    }

    if (routeIds.length > 0) {
      entities = filterTripEntitiesByRouteIds<TripUpdateEntity>(
        entities,
        routeIds,
      );
    }

    return entities;
  }
}
