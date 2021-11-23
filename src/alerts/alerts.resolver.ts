import { Args, Query, Resolver } from '@nestjs/graphql';
import { AlertsService } from 'alerts/alerts.service';
import { FilterArgs } from 'args/filter.args';
import { AlertEntity } from 'entities/alert.entity';
import { GetAlertsArgs } from './alerts.args';

@Resolver(() => AlertEntity)
export class AlertsResolver {
  constructor(private alertsService: AlertsService) {}

  @Query(() => [AlertEntity])
  alerts(
    @Args() getAlertsArgs: GetAlertsArgs,
    @Args() filter: FilterArgs,
  ): Promise<AlertEntity[]> {
    return this.alertsService.getAlerts(getAlertsArgs, filter);
  }
}
