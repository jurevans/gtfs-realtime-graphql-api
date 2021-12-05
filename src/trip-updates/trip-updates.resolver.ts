import { Args, Query, Resolver } from '@nestjs/graphql';
import { TripUpdatesService } from 'trip-updates/trip-updates.service';
import { TripUpdateEntity } from 'entities/trip-update.entity';
import {
  GetTripUpdatesArgs,
  FilterTripUpdatesArgs,
} from 'trip-updates/trip-updates.args';

@Resolver(() => TripUpdateEntity)
export class TripUpdatesResolver {
  constructor(private tripUpdatesService: TripUpdatesService) {}

  @Query(() => [TripUpdateEntity], { name: 'tripUpdates' })
  getTripUpdates(
    @Args() getTripUpdates: GetTripUpdatesArgs,
    @Args() filter: FilterTripUpdatesArgs,
  ): Promise<TripUpdateEntity[]> {
    return this.tripUpdatesService.getTripUpdates(getTripUpdates, filter);
  }
}
