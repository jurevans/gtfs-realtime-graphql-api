import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AlertsService } from 'alerts/alerts.service';
import { AlertEntity } from 'entities/alert.entity';

@Resolver(() => AlertEntity)
export class AlertsResolver {
  constructor(private alertsService: AlertsService) {}

  @Query(() => [AlertEntity])
  alerts(
    @Args('feedIndex', { type: () => Int }) feedIndex: number,
  ): Promise<AlertEntity[]> {
    return this.alertsService.getAlerts(feedIndex);
  }
}