import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FeedService } from 'feed/feed.service';
import { Alert } from 'proto/gtfs-realtime';
import { AlertEntity } from 'entities/alert.entity';
import { getAlertUrls, getConfigByFeedIndex } from 'util/';
import { EntityTypes } from 'constants/';
import { GetAlertsArgs } from 'alerts/alerts.args';

@Injectable()
export class AlertsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly feedService: FeedService,
  ) {}

  public async getAlerts(args: GetAlertsArgs): Promise<AlertEntity[]> {
    const { feedIndex } = args;
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
        type: EntityTypes.ALERT,
      },
    );

    return <AlertEntity[]>entities;
  }
}
