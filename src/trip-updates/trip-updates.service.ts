import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TripUpdate } from 'proto/gtfs-realtime';
import { TripUpdateEntity } from 'entities/trip-update.entity';
import { FeedService } from 'feed/feed.service';
import { getConfigByFeedIndex, getUrlsByRouteIds } from 'util/';

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

    const entities = await this.feedService.getFeedMessages<
      TripUpdateEntity,
      TripUpdate
    >({
      feedIndex,
      urls,
      entity: TripUpdateEntity,
      type: 'tripUpdate',
    });

    return <TripUpdateEntity[]>entities;
  }
}
