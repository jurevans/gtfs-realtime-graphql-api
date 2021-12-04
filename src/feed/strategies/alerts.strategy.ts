import { AlertEntity } from 'entities/alert.entity';
import { IFeedStrategy } from 'feed/feed-messages.context';
import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';
import { getFeedEntitiesByType } from 'util/';
import { EntityTypes } from 'constants/';

export class AlertsStrategy implements IFeedStrategy<AlertEntity> {
  public getEntities(feeds: FeedMessage[]): AlertEntity[] {
    const entities = feeds.map((feed: FeedMessage) =>
      getFeedEntitiesByType(feed, EntityTypes.ALERT),
    );

    return entities
      .flat()
      .map(
        (feedEntity: FeedEntity) =>
          new AlertEntity(feedEntity[EntityTypes.ALERT]),
      );
  }
}
