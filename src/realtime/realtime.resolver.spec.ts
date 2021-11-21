import { Test, TestingModule } from '@nestjs/testing';
import { RealtimeResolver } from './realtime.resolver';

describe('RealtimeResolver', () => {
  let resolver: RealtimeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealtimeResolver],
    }).compile();

    resolver = module.get<RealtimeResolver>(RealtimeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
