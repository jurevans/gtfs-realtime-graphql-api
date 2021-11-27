import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheTtlSeconds } from 'constants/';
import { VehiclePositionsService } from './vehicle-positions.service';
import { VehiclePositionsResolver } from './vehicle-positions.resolver';
import { FeedService } from 'feed/feed.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService): CacheModuleOptions => ({
        store: redisStore,
        ...configService.get('redis'),
        ttl: CacheTtlSeconds.FIVE_SECONDS,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [VehiclePositionsService, VehiclePositionsResolver, FeedService],
})
export class VehiclePositionsModule {}
