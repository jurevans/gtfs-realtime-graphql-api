import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';
import { AlertEntity } from 'entities/alert.entity';
import { EntityTypes } from 'constants/';
import { getFeedEntitiesByType } from 'util/';

export class AlertsStrategy {
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
