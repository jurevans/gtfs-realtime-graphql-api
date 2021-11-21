import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { AlertsService } from 'alerts/alerts.service';
import { AlertsResolver } from 'alerts/alerts.resolver';
import { FeedService } from 'feed/feed.service';
import { CacheTtlSeconds } from 'constants/';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService): CacheModuleOptions => ({
        store: redisStore,
        ...configService.get('redis'),
        ttl: CacheTtlSeconds.ONE_MINUTE,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AlertsService, AlertsResolver, FeedService],
})
export class AlertsModule {}
