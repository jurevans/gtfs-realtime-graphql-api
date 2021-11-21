import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import redisConfig from 'config/redis.config';
import gtfsConfig from 'config/gtfs.config';
import { CacheTtlSeconds } from 'constants/';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
