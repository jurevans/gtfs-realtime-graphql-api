import { Args, Query, Resolver } from '@nestjs/graphql';
import { TripUpdatesService } from 'trip-updates/trip-updates.service';
import { TripUpdateEntity } from 'entities/trip-update.entity';
import { GetTripUpdatesArgs } from 'trip-updates/trip-updates.args';
import { RouteFilterArgs } from 'args/route-filter.args';

@Resolver(() => TripUpdateEntity)
export class TripUpdatesResolver {
  constructor(private tripUpdatesService: TripUpdatesService) {}

  @Query(() => [TripUpdateEntity])
  tripUpdates(
    @Args() getTripUpdates: GetTripUpdatesArgs,
    @Args() filter: RouteFilterArgs,
  ): Promise<TripUpdateEntity[]> {
    return this.tripUpdatesService.getTripUpdates(getTripUpdates, filter);
  }
}
