import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/common';
import { AlertsService } from 'alerts/alerts.service';
import { AlertsResolver } from 'alerts/alerts.resolver';
import { FeedService } from 'feed/feed.service';

describe('AlertsService', () => {
  let service: AlertsService;

  const mockConfigService = {};
  const mockCacheManager = {};
  const mockResolver = {};
  const mockFeedService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: AlertsResolver,
          useValue: mockResolver,
        },
        {
          provide: FeedService,
          useValue: mockFeedService,
        },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
