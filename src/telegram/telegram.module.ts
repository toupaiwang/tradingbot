import { forwardRef, Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Message } from '../message/message.entity';
import { TokenInfoModule } from '../token-info/token-info.module';
import { TokenInfoService } from '../token-info/token-info.service';
import { TokenInfo } from '../token-info/token-info.entity';
import { PumpFunService } from '../token-info/pump-fun/pump-fun.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { MessageModule } from '../message/message.module';
import { MessageService } from '../message/message.service';
import { ScreenModule } from './screen/screen.module';
import { WalletModule } from '../wallet/wallet.module';
import { SettingModule } from '../setting/setting.module';
import { WalletUpdate } from './wallet.update';
import { InviteUpdate } from './invite.update';
import { SettingUpdate } from './setting.update';
import { TradeModule } from '../trade/trade.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User, Message, TokenInfo]),
    TokenInfoModule,
    RedisCacheModule,
    MessageModule,
    ScreenModule,
    WalletModule,
    SettingModule,
    forwardRef(() => TradeModule),
  ],
  providers: [
    TelegramUpdate,
    WalletUpdate,
    InviteUpdate,
    SettingUpdate,
    TelegramService,
    TokenInfoService,
    PumpFunService,
    RedisCacheService,
    MessageService,
  ],
  exports: [TelegramService],
})
export class TelegramModule {}
