import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TripUpdatesService } from 'trip-updates/trip-updates.service';
import { TripUpdatesResolver } from 'trip-updates/trip-updates.resolver';
import { FeedService } from 'feed/feed.service';

describe('TripUpdatesService', () => {
  let service: TripUpdatesService;

  const mockResolver = {};
  const mockConfigService = {};
  const mockCacheManager = {};
  const mockFeedService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripUpdatesService,
        {
          provide: TripUpdatesResolver,
          useValue: mockResolver,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: FeedService,
          useValue: mockFeedService,
        },
      ],
    }).compile();

    service = module.get<TripUpdatesService>(TripUpdatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
