import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAlertUrls, getConfigByFeedIndex } from 'util/';
import { Alert } from 'proto/gtfs-realtime';
import { AlertEntity } from 'entities/alert.entity';
import { FeedService } from 'feed/feed.service';

@Injectable()
export class AlertsService {
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

    const entities = await this.feedService.getFeedMessages<AlertEntity, Alert>(
      {
        feedIndex,
        urls,
        entity: AlertEntity,
        type: 'alert',
      },
    );

    return <AlertEntity[]>entities;
  }
}
