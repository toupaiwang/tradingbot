import { Action, Ctx, Hears, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';
import { WalletScreen } from './screen/wallet.screen';

@Update()
export class TelegramUpdate {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly walletScreen: WalletScreen,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await this.telegramService.start(ctx);
  }

  @Hears(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)
  async tokenInfo(@Ctx() ctx: Context) {
    console.log(ctx.msgId);
    await this.telegramService.getTokenInfo(ctx);
  }

  @Action('delete_message')
  async deleteMessage(@Ctx() ctx: Context) {
    await ctx.deleteMessage(); // 删除消息
  }

  @Action('contract_refresh')
  async contractRefresh(@Ctx() ctx: Context) {
    await this.telegramService.contractRefresh(ctx);
  }

  @Action(/^buy_(\d+(?:\.\d+)?)$/)
  async buy(@Ctx() ctx: Context) {
    // @ts-expect-error should be number
    const amount = ctx.match[1];
    await this.telegramService.buy(ctx, amount);
  }

  @Action('buy_custom')
  async buyCustom(@Ctx() ctx: Context) {
    await this.telegramService.buyCustom(ctx);
  }

  @Hears(/^(\d+(?:\.\d+)?)$/)
  async handleAmount(@Ctx() ctx: Context) {
    await this.telegramService.handleAmount(ctx);
  }

  // Sell
  @Action(/^sell_(\d+(?:\.\d+)?)$/)
  async sell(@Ctx() ctx: Context) {
    // @ts-expect-error should be number
    const amount = ctx.match[1];
    await this.telegramService.sell(ctx, amount);
  }

  @Action('sell_custom')
  async sellCustom(@Ctx() ctx: Context) {
    await this.telegramService.sellCustom(ctx);
  }

  @Action(/^change_wallet_([1-9A-HJ-NP-Za-km-z]{32,44})$/)
  async changeWallet(@Ctx() ctx: Context) {
    await this.telegramService.changeWallet(ctx);
  }
}
