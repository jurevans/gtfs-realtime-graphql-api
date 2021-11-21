import { Module } from '@nestjs/common';
import { RealtimeService } from 'realtime/realtime.service';
import { RealtimeResolver } from './realtime.resolver';
import { FeedService } from './feed.service';
@Module({
  providers: [RealtimeService, RealtimeResolver, FeedService],
})
export class RealtimeModule {}
