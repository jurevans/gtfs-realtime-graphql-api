import { Args, Query, Resolver } from '@nestjs/graphql';
import { AlertsService } from 'alerts/alerts.service';
import { FeedArgs } from 'args/feed.args';
import { AlertEntity } from 'entities/alert.entity';
import { FilterAlertsArgs } from 'alerts/alerts.args';

@Resolver(() => AlertEntity)
export class AlertsResolver {
  constructor(private alertsService: AlertsService) {}

  @Query(() => [AlertEntity])
  alerts(
    @Args() getAlertsArgs: FeedArgs,
    @Args() filter: FilterAlertsArgs,
  ): Promise<AlertEntity[]> {
    return this.alertsService.getAlerts(getAlertsArgs, filter);
  }
}
