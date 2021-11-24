import { Args, Query, Resolver } from '@nestjs/graphql';
import { AlertsService } from 'alerts/alerts.service';
import { AlertEntity } from 'entities/alert.entity';
import { GetAlertsArgs } from 'alerts/alerts.args';
import { FilterAlertsArgs } from 'alerts/filter-alerts.args';

@Resolver(() => AlertEntity)
export class AlertsResolver {
  constructor(private alertsService: AlertsService) {}

  @Query(() => [AlertEntity])
  alerts(
    @Args() getAlertsArgs: GetAlertsArgs,
    @Args() filter: FilterAlertsArgs,
  ): Promise<AlertEntity[]> {
    return this.alertsService.getAlerts(getAlertsArgs, filter);
  }
}
