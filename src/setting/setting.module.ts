import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { UserModule } from '../user/user.module';
import { SettingController } from './setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './setting.entity';
import { User } from '../user/user.entity';
import { WalletModule } from '../wallet/wallet.module';
import { Wallet } from '../wallet/wallet.entity';

@Module({
  imports: [
    UserModule,
    WalletModule,
    TypeOrmModule.forFeature([Setting, User, Wallet]),
  ],
  providers: [SettingService],
  controllers: [SettingController],
  exports: [SettingService],
})
export class SettingModule {}
