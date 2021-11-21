import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VehiclePositionsService } from './vehicle-positions.service';
import { FeedService } from 'feed/feed.service';

describe('VehiclePositionsService', () => {
  let service: VehiclePositionsService;

  const mockCacheManager = {};
  const mockConfigService = {};
  const mockFeedService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclePositionsService,
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

    service = module.get<VehiclePositionsService>(VehiclePositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
