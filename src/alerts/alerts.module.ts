import { Module } from '@nestjs/common';
import { AlertsService } from 'alerts/alerts.service';
import { AlertsResolver } from 'alerts/alerts.resolver';
import { FeedService } from 'feed/feed.service';
@Module({
  providers: [AlertsService, AlertsResolver, FeedService],
})
export class AlertsModule {}
