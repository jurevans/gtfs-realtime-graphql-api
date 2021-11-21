import { Test, TestingModule } from '@nestjs/testing';
import { TripUpdatesService } from './trip-updates.service';

describe('TripUpdatesService', () => {
  let service: TripUpdatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripUpdatesService],
    }).compile();

    service = module.get<TripUpdatesService>(TripUpdatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
