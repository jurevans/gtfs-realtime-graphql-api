import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FeedService } from 'feed/feed.service';
import { Alert } from 'proto/gtfs-realtime';
import { AlertEntity } from 'entities/alert.entity';
import {
  filterAlertsByRouteIds,
  getAlertUrls,
  getGTFSConfigByFeedIndex,
} from 'util/';
import { EntityTypes } from 'constants/';
import { FeedArgs } from 'args/feed.args';
import { FilterAlertsArgs } from 'alerts/alerts.args';

@Injectable()
export class AlertsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly feedService: FeedService,
  ) {}

  public async getAlerts(
    args: FeedArgs,
    filter: FilterAlertsArgs,
  ): Promise<AlertEntity[]> {
    const { feedIndex } = args;
    const { routeIds } = filter;

    const config = getGTFSConfigByFeedIndex(this.configService, feedIndex);

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

    if (routeIds.length > 0) {
      return <AlertEntity[]>filterAlertsByRouteIds(entities, routeIds);
    }

    return <AlertEntity[]>entities;
  }
}
