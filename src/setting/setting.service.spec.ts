import { Test, TestingModule } from '@nestjs/testing';
import { SettingService } from './setting.service';
import { UserModule } from '../user/user.module';
import { WalletModule } from '../wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Wallet } from '../wallet/wallet.entity';
import { Setting } from './setting.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from '../config/typeorm.config';

describe('SettingService', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingService, ConfigService],
      imports: [
        UserModule,
        WalletModule,
        ConfigModule.forRoot({}),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: typeOrmConfig,
        }),
        TypeOrmModule.forFeature([Setting, User, Wallet]),
      ],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
