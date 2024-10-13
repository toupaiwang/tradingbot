import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { UserModule } from '../user/user.module';
import { TradeService } from './trade.service';
import { SettingModule } from '../setting/setting.module';
import { SolanaService } from './solana.service';
import { JitoService } from './jito.service';
import { BullModule } from '@nestjs/bullmq';
import { ResultConsumer } from './result.consumer';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trade]),
    UserModule,
    SettingModule,
    BullModule.registerQueue({
      name: 'trade_result',
    }),
    TelegramModule,
  ],
  providers: [TradeService, SolanaService, JitoService, ResultConsumer],
  exports: [TradeService, SolanaService],
})
export class TradeModule {}
