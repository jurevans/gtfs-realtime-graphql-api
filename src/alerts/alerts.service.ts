import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FeedService } from 'feed/feed.service';
import { AlertEntity } from 'entities/alert.entity';
import {
  filterAlertsByRouteIds,
  getUrlsByType,
  getGTFSConfigByFeedIndex,
} from 'util/';
import { EntityTypes } from 'constants/';
import { GetAlertsArgs } from 'alerts/alerts.args';
import { FilterAlertsArgs } from 'alerts/filter-alerts.args';
import { IConfig } from 'interfaces/config.interface';
import { FeedMessages } from 'feed/feed-messages.context';
import { AlertsStrategy } from 'feed/strategies/alerts.strategy';

@Injectable()
export class AlertsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly feedService: FeedService,
  ) {}

  public async getAlerts(
    args: GetAlertsArgs,
    filter: FilterAlertsArgs,
  ): Promise<AlertEntity[]> {
    const { feedIndex } = args;
    const { routeIds } = filter;

    const config: IConfig = getGTFSConfigByFeedIndex(
      this.configService,
      feedIndex,
    );

    if (!config) {
      throw new HttpException(
        `No valid configuration found for feedIndex: ${feedIndex}!`,
        500,
      );
    }

    const { endpoints } = config;
    const urls = getUrlsByType(endpoints, EntityTypes.ALERT);

    const feedMessages = await this.feedService.getFeedMessages({
      feedIndex,
      urls,
    });

    const entities = new FeedMessages<AlertEntity>(
      new AlertsStrategy(),
    ).getEntities(feedMessages);

    if (routeIds.length > 0) {
      return <AlertEntity[]>filterAlertsByRouteIds(entities, routeIds);
    }

    return entities;
  }
}
