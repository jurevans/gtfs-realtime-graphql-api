import { Module } from '@nestjs/common';
import { TripUpdatesService } from 'trip-updates/trip-updates.service';
import { TripUpdatesResolver } from 'trip-updates/trip-updates.resolver';
import { FeedService } from 'feed/feed.service';

@Module({
  providers: [TripUpdatesService, TripUpdatesResolver, FeedService],
})
export class TripUpdatesModule {}
