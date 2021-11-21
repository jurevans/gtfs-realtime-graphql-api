import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { RealtimeService } from 'realtime/realtime.service';
import { AlertEntity } from 'realtime/entities/alert.entity';

@Resolver(() => AlertEntity)
export class RealtimeResolver {
  constructor(private realtimeService: RealtimeService) {}

  @Query(() => [AlertEntity])
  alerts(
    @Args('feedIndex', { type: () => Int }) feedIndex: number,
  ): Promise<AlertEntity[]> {
    return this.realtimeService.getAlerts(feedIndex);
  }
}
