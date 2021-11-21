import { Module } from '@nestjs/common';
import { RealtimeService } from 'realtime/realtime.service';
import { RealtimeResolver } from './realtime.resolver';

@Module({
  providers: [RealtimeService, RealtimeResolver],
})
export class RealtimeModule {}
