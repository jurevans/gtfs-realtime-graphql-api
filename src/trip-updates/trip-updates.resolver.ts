import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { TripUpdatesService } from 'trip-updates/trip-updates.service';
import { TripUpdateEntity } from 'entities/trip-update.entity';

@Resolver(() => TripUpdateEntity)
export class TripUpdatesResolver {
  constructor(private tripUpdatesService: TripUpdatesService) {}

  @Query(() => [TripUpdateEntity])
  tripUpdates(
    @Args('feedIndex', { type: () => Int }) feedIndex: number,
    @Args('routeIds', { type: () => [String] }) routeIds: string[],
  ): Promise<TripUpdateEntity[]> {
    return this.tripUpdatesService.getTripUpdates(feedIndex, routeIds);
  }
}
