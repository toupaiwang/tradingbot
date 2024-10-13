import { Test, TestingModule } from '@nestjs/testing';
import { TokenInfoService } from './token-info.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { PumpFunModule } from './pump-fun/pump-fun.module';
import { PumpFunService } from './pump-fun/pump-fun.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenInfo } from './token-info.entity';
import { typeOrmConfig } from '../config/typeorm.config';

describe('TokenInfoService', () => {
  let service: TokenInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({}),
        PumpFunModule,
        RedisCacheModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: typeOrmConfig,
        }),
        TypeOrmModule.forFeature([TokenInfo]),
      ],
      providers: [TokenInfoService, PumpFunService, RedisCacheService],
    }).compile();

    service = module.get<TokenInfoService>(TokenInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test getTokeninfo', async () => {
    const data = await service.getTokenInfo(
      'SHARKSYJjqaNyxVfrpnBN9pjgkhwDhatnMyicWPnr1s',
    );
    console.log(data);
  });

  it('test getTokenPrice', async () => {
    const data = await service.getTokenPrice(
      'SHARKSYJjqaNyxVfrpnBN9pjgkhwDhatnMyicWPnr1s',
    );
    console.log(data);
  });

  it('test getFullTokenInfo', async () => {
    const data = await service.getFullTokenInfo(
      'AiQcnL5gPjEXVH1E1FGUdN1WhPz4qXAZfQJxpGrJpump',
    );
    console.log(data);
  });
});
