import { Test, TestingModule } from '@nestjs/testing';
import { PumpFunService } from './pump-fun.service';
import { RedisCacheService } from '../../redis-cache/redis-cache.service';
import { RedisCacheModule } from '../../redis-cache/redis-cache.module';
import { ConfigModule } from '@nestjs/config';

describe('PumpFunService', () => {
  let service: PumpFunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisCacheModule, ConfigModule.forRoot({})],
      providers: [PumpFunService, RedisCacheService],
    }).compile();

    service = module.get<PumpFunService>(PumpFunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('isPumpFun', async () => {
    expect(
      await service.getPumpInfo('AiQcnL5gPjEXVH1E1FGUdN1WhPz4qXAZfQJxpGrJpump'),
    ).toBeDefined();
  });
});
