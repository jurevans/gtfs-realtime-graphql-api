import { VehiclePositionEntity } from 'entities/vehicle-position.entity';
import { IFeedStrategy } from 'feed/feed-messages.context';
import { FeedEntity, FeedMessage } from 'proto/gtfs-realtime';
import { getFeedEntitiesByType } from 'util/';
import { EntityTypes } from 'constants/';

export class VehiclePositionsStrategy
  implements IFeedStrategy<VehiclePositionEntity>
{
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
