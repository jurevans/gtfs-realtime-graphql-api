import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';
import redisConfig from 'config/redis.config';
import gtfsConfig from 'config/gtfs.config';
import { CacheTtlSeconds } from 'constants/';
import { AlertsModule } from './alerts/alerts.module';
import { TripUpdatesModule } from './trip-updates/trip-updates.module';
import { VehiclePositionsModule } from './vehicle-positions/vehicle-positions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [redisConfig, gtfsConfig],
    }),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService): CacheModuleOptions => ({
        store: redisStore,
        ...configService.get('redis'),
        ttl: CacheTtlSeconds.THIRTY_SECONDS,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    AlertsModule,
    TripUpdatesModule,
    VehiclePositionsModule,
  ],
})
export class AppModule {}
