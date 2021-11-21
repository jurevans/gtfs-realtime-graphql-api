import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from 'alerts/alerts.service';
import { AlertsResolver } from 'alerts/alerts.resolver';
import { ConfigService } from '@nestjs/config';
import { FeedService } from 'feed/feed.service';

describe('AlertsService', () => {
  let service: AlertsService;

  const mockConfigService = {};
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
