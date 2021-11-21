import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';
import { getAlertUrls, getConfigByFeedIndex } from 'util/';
import { AlertEntity } from 'realtime/entities/alert.entity';

@Injectable()
export class RealtimeService {
  constructor(private readonly configService: ConfigService) {}

  private async _getFeedMessage(props: {
    feedIndex: number;
    endpoint: string;
  }): Promise<FeedMessage> {
    const { feedIndex, endpoint } = props;
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

    return <FeedMessage>FeedMessage.toJSON(feedMessage);
  }

  public async getAlerts(feedIndex: number): Promise<AlertEntity[]> {
    const config = getConfigByFeedIndex(
      this.configService,
      'gtfs-realtime',
      feedIndex,
    );

    const { feedUrls } = config;
    const urls = getAlertUrls(feedUrls);
    const feeds: FeedMessage[] = await Promise.all(
      urls.map(
        async (endpoint: string) => <FeedMessage>await this._getFeedMessage({
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
