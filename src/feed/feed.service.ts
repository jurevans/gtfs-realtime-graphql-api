import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { IConfig } from 'interfaces/config.interface';
import { FeedMessage } from 'proto/gtfs-realtime';
import { getGTFSConfigByFeedIndex } from 'util/';

@Injectable()
export class FeedService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  public async getFeedMessages(props: {
    feedIndex: number;
    urls: string[];
  }): Promise<FeedMessage[]> {
    const { feedIndex, urls } = props;

    return await Promise.all(
      urls.map(
        async (endpoint: string) =>
          <FeedMessage>await this._getFeedMessage(feedIndex, endpoint),
      ),
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

    const config: IConfig = getGTFSConfigByFeedIndex(
      this.configService,
      feedIndex,
    );
    const { accessKey }: { accessKey: string } = config;
    const accessKeyValue: string = this.configService.get(accessKey);
    const options: any = {
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'x-api-key': accessKeyValue,
      },
    };

    const response = await axios(url, options);
    const buffer = await response.data;
    const feedMessage = FeedMessage.decode(buffer);
    this.cacheManager.set(url, feedMessage);

    return feedMessage;
  }
}
