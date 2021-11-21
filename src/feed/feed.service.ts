import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
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

    const feeds: FeedMessage[] = await Promise.all(
      urls.map(
        async (endpoint: string) =>
          <FeedMessage>await this._getFeedMessage(feedIndex, endpoint),
      ),
    );

    const entities = feeds.map((feed: FeedMessage) =>
      getFeedEntitiesByType(feed, type),
    );

    return <T1[]>(
      entities
        .flat()
        .map((feedEntity: FeedEntity) => new entity(feedEntity[type]))
    );
  }

  private async _getFeedMessage(
    feedIndex: number,
    url: string,
  ): Promise<FeedMessage> {
    const feedMessageInCache: FeedMessage = await this.cacheManager.get(url);
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

    const response = await fetch(url, options);
    const buffer = await response.buffer();
    const feedMessage = FeedMessage.decode(buffer);

    const feedMessageJSON = FeedMessage.toJSON(feedMessage);
    this.cacheManager.set(url, feedMessageJSON);

    return await this.cacheManager.get(url);
  }
}
