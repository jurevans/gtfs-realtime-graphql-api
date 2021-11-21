import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';
import { getAlertUrls, getConfigByFeedIndex } from 'util/';
import { AlertEntity } from 'realtime/entities/alert.entity';
import { FeedService } from 'realtime/feed.service';

@Injectable()
export class RealtimeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly feedService: FeedService,
  ) {}

  public async getAlerts(feedIndex: number): Promise<AlertEntity[]> {
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
    const urls = getAlertUrls(feedUrls);
    const feeds: FeedMessage[] = await Promise.all(
      urls.map(
        async (endpoint: string) =>
          <FeedMessage>await this.feedService.getFeedMessage({
            feedIndex,
            endpoint,
          }),
      ),
    );

    const entities = feeds.map((feed: FeedMessage) => feed.entity);

    return <AlertEntity[]>(
      entities.flat().map((entity: FeedEntity) => new AlertEntity(entity.alert))
    );
  }
}
