import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TripUpdateEntity } from 'entities/trip-update.entity';
import { FeedService } from 'feed/feed.service';
import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';
import {
  getConfigByFeedIndex,
  getUrlsByRouteIds,
  getFeedEntitiesByType,
} from 'util/';

@Injectable()
export class TripUpdatesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly feedService: FeedService,
  ) {}

  public async getTripUpdates(feedIndex: number, routeIds: string[]) {
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
    const feeds: FeedMessage[] = await Promise.all(
      urls.map(
        async (endpoint: string) =>
          <FeedMessage>await this.feedService.getFeedMessage({
            feedIndex,
            endpoint,
          }),
      ),
    );

    const entities = feeds
      .flat()
      .map((feed: FeedMessage) => getFeedEntitiesByType(feed, 'tripUpdate'));

    return <TripUpdateEntity[]>(
      entities
        .flat()
        .map((entity: FeedEntity) => new TripUpdateEntity(entity.tripUpdate))
    );
  }
}
