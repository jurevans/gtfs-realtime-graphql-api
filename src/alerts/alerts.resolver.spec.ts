import { Test, TestingModule } from '@nestjs/testing';
import { AlertsResolver } from 'alerts/alerts.resolver';
import { AlertsService } from 'alerts/alerts.service';

describe('AlertsResolver', () => {
  let resolver: AlertsResolver;

  const mockAlertsService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsResolver,
        {
          provide: AlertsService,
          useValue: mockAlertsService,
        },
      ],
    }).compile();

    resolver = module.get<AlertsResolver>(AlertsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
