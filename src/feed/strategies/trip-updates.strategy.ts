import { TripUpdateEntity } from 'entities/trip-update.entity';
import { IFeedStrategy } from 'feed/feed-messages.context';
import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';
import { getFeedEntitiesByType } from 'util/';
import { EntityTypes } from 'constants/';

export class TripUpdatesStrategy implements IFeedStrategy<TripUpdateEntity> {
  public getEntities(feeds: FeedMessage[]): TripUpdateEntity[] {
    const entities = feeds.map((feed: FeedMessage) =>
      getFeedEntitiesByType(feed, EntityTypes.TRIP_UPDATE),
    );

    return entities
      .flat()
      .map(
        (feedEntity: FeedEntity) =>
          new TripUpdateEntity(feedEntity[EntityTypes.TRIP_UPDATE]),
      );
  }
}
