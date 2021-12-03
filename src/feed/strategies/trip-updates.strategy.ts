import { EntityTypes } from 'constants/';
import { TripUpdateEntity } from 'entities/trip-update.entity';
import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';
import { getFeedEntitiesByType } from 'util/';

export class TripUpdatesStrategy {
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
