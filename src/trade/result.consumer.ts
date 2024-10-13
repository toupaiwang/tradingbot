import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Connection } from '@solana/web3.js';
import { ConfigService } from '@nestjs/config';
import { TradeService } from './trade.service';
import { TelegramService } from '../telegram/telegram.service';
import { UserService } from '../user/user.service';

@Processor('trade_result')
export class ResultConsumer extends WorkerHost {
  get connection(): Connection {
    return this._connection;
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly tradeService: TradeService,
    private readonly telegramService: TelegramService,
    private readonly userService: UserService,
  ) {
    super();
  }

  private _connection = new Connection(
    this.configService.get('SOLANA_ENDPOINT'),
  );

  async process(job: Job) {
    const txid = job.data.txid;
    const userId = job.data.userId;
    const referralBalance = job.data.referralBalance;
    const result = await this.connection.getSignatureStatus(txid);
    if (
      result &&
      result.value &&
      result.value.confirmationStatus === 'confirmed'
    ) {
      console.log(`Transaction ${txid} is confirmed.`);
      await this.tradeService.confirmTrade(txid);
      await this.telegramService.sendMessage(
        userId,
        `交易成功, 点击查看 <a href="https://solscan.io/tx/${txid}">点击查看区块浏览器</a>\n`,
      );
      await this.userService.addReferralBalance(userId, referralBalance);
    } else {
      console.log(`Transaction ${txid} is not confirmed yet.`);
    }
  }
}
