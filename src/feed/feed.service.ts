import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import fetch from 'node-fetch';
import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';
import { getConfigByFeedIndex, getFeedEntitiesByType } from 'util/';

@Injectable()
export class FeedService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  public async getFeedMessages<T1, T2>(props: {
    feedIndex: number;
    urls: string[];
    entity: { new (partial?: T2): T1 };
    type: string;
  }): Promise<T1[]> {
    const { feedIndex, urls, entity, type } = props;
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

    const feeds: FeedMessage[] = await Promise.all(
      urls.map(
        async (endpoint: string) =>
          <FeedMessage>await this._getFeedMessage(feedIndex, endpoint),
      ),
    );
    const entities = feeds
      .flat()
      .map((feed: FeedMessage) => getFeedEntitiesByType(feed, type));

    return <T1[]>(
      entities
        .flat()
        .map((gtfsEntity: FeedEntity) => new entity(gtfsEntity[type]))
    );
  }

  private async _getFeedMessage(
    feedIndex: number,
    endpoint: string,
  ): Promise<FeedMessage> {
    const feedMessageInCache = await this.cacheManager.get(endpoint);
    if (feedMessageInCache) {
      return feedMessageInCache;
    }

    const config = getConfigByFeedIndex(
      this.configService,
      'gtfs-realtime',
      feedIndex,
    );
    const { accessKey } = config;
    const accessKeyValue = this.configService.get(accessKey);
    const options = {
      method: 'GET',
      headers: {
        'x-api-key': accessKeyValue,
      },
    };

    const response = await fetch(endpoint, options);
    const buffer = await response.buffer();
    const feedMessage = FeedMessage.decode(buffer);

    const feedMessageJSON = FeedMessage.toJSON(feedMessage);
    this.cacheManager.set(endpoint, feedMessageJSON);

    return await (<FeedMessage>this.cacheManager.get(endpoint));
  }
}
