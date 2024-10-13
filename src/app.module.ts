import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenInfoModule } from './token-info/token-info.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { WalletModule } from './wallet/wallet.module';
import { TradeModule } from './trade/trade.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { SettingModule } from './setting/setting.module';
import { TelegramModule } from './telegram/telegram.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TokenInfoModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RedisCacheModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    UserModule,
    WalletModule,
    TradeModule,
    MessageModule,
    SettingModule,
    TelegramModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get('TELEGRAM_BOT_TOKEN'),
        include: [TelegramModule],
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
