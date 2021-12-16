import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FeedService } from 'feed/feed.service';
import { AlertEntity } from 'entities/alert.entity';
import { GetAlertsArgs, FilterAlertsArgs } from 'alerts/alerts.args';
import { FeedMessages } from 'feed/feed-messages.context';
import {
  filterAlertsByRouteIds,
  getUrlsByType,
  getGTFSConfigByFeedIndex,
  getFeedEntitiesByType,
} from 'util/';
import { EntityTypes } from 'constants/';
import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';

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

    const config = getGTFSConfigByFeedIndex(this.configService, feedIndex);

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

    const entities = new FeedMessages<AlertEntity>((feeds: FeedMessage[]) =>
      getFeedEntitiesByType(feeds, EntityTypes.ALERT).map(
        (feedEntity: FeedEntity) =>
          new AlertEntity(feedEntity[EntityTypes.ALERT]),
      ),
    ).getEntities(feedMessages);

    if (routeIds.length > 0) {
      return <AlertEntity[]>filterAlertsByRouteIds(entities, routeIds);
    }

    return entities;
  }
}
