import {
  CacheModule,
  CacheModuleOptions,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';
import { AuthModule } from 'auth/auth.module';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { AlertsModule } from 'alerts/alerts.module';
import { TripUpdatesModule } from 'trip-updates/trip-updates.module';
import { VehiclePositionsModule } from 'vehicle-positions/vehicle-positions.module';
import authConfig from 'config/auth.config';
import redisConfig from 'config/redis.config';
import gtfsConfig from 'config/gtfs.config';
import { CacheTtlSeconds } from 'constants/';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [authConfig, redisConfig, gtfsConfig],
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
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
    }),
    AlertsModule,
    TripUpdatesModule,
    VehiclePositionsModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('graphql');
  }
}
