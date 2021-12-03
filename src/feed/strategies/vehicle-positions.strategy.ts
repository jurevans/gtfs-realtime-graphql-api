import { EntityTypes } from 'constants/';
import { VehiclePositionEntity } from 'entities/vehicle-position.entity';
import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';
import { getFeedEntitiesByType } from 'util/';

export class VehiclePositionsStrategy {
  public getEntities(feeds: FeedMessage[]): VehiclePositionEntity[] {
    const entities = feeds.map((feed: FeedMessage) =>
      getFeedEntitiesByType(feed, EntityTypes.VEHICLE_POSITION),
    );

    return entities
      .flat()
      .map(
        (feedEntity: FeedEntity) =>
          new VehiclePositionEntity(feedEntity[EntityTypes.VEHICLE_POSITION]),
      );
  }
}
