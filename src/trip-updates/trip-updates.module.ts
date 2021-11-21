import { Module } from '@nestjs/common';
import { TripUpdatesService } from './trip-updates.service';

@Module({
  providers: [TripUpdatesService],
})
export class TripUpdatesModule {}
