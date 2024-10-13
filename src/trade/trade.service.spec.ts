import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';
import { SettingModule } from '../setting/setting.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from '../config/typeorm.config';
import { Wallet } from '../wallet/wallet.entity';
import { User } from '../user/user.entity';
import { Setting } from '../setting/setting.entity';
import { SolanaService } from './solana.service';
import { JitoService } from './jito.service';

describe('TradeService', () => {
  let service: TradeService;
  let solanaService: SolanaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeService, SolanaService, JitoService],
      imports: [
        ConfigModule.forRoot({}),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: typeOrmConfig,
        }),
        TypeOrmModule.forFeature([Setting, User, Wallet]),
        SettingModule,
      ],
    }).compile();

    service = module.get<TradeService>(TradeService);
    solanaService = module.get<SolanaService>(SolanaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
