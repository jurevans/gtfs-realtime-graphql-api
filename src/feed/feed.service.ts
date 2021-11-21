import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import fetch from 'node-fetch';
import { FeedMessage } from 'proto/gtfs-realtime';
import { getConfigByFeedIndex } from 'util/';

@Injectable()
export class FeedService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  public async getFeedMessage(props: {
    feedIndex: number;
    endpoint: string;
  }): Promise<FeedMessage> {
    const { feedIndex, endpoint } = props;

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
