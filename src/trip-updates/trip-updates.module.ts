import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { TripUpdatesService } from 'trip-updates/trip-updates.service';
import { TripUpdatesResolver } from 'trip-updates/trip-updates.resolver';
import { FeedService } from 'feed/feed.service';
import { CacheTtlSeconds } from 'constants/';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService): CacheModuleOptions => ({
        store: redisStore,
        ...configService.get('redis'),
        ttl: CacheTtlSeconds.THIRTY_SECONDS,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TripUpdatesService, TripUpdatesResolver, FeedService],
})
export class TripUpdatesModule {}
