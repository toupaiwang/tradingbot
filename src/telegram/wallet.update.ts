import { Action, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { WalletScreen } from './screen/wallet.screen';

@Update()
export class WalletUpdate {
  constructor(private readonly walletScreen: WalletScreen) {}

  @Action('wallet')
  async wallet(@Ctx() ctx: Context) {
    await this.walletScreen.getWalletScreen(ctx);
  }

  @Action('generate_wallet')
  async generateWallet(@Ctx() ctx: Context) {
    await this.walletScreen.generateWallet(ctx, ctx.from.id);
  }

  @Action('remove_wallet')
  async removeWalletScreen(@Ctx() ctx: Context) {
    await this.walletScreen.removeWalletScreen(ctx, ctx.from.id);
  }

  @Action(/^remove_wallet_([1-9A-HJ-NP-Za-km-z]{32,44})$/)
  async removeWallet(@Ctx() ctx: Context) {
    if ('match' in ctx) {
      await this.walletScreen.removeWallet(ctx, ctx.from.id, ctx.match[1]);
    }
  }

  @Action('switch_wallet')
  async switchWalletScreen(@Ctx() ctx: Context) {
    await this.walletScreen.switchWalletScreen(ctx, ctx.from.id);
  }

  @Action(/^switch_wallet_([1-9A-HJ-NP-Za-km-z]{32,44})$/)
  async switchWallet(@Ctx() ctx: Context) {
    if ('match' in ctx) {
      await this.walletScreen.switchWallet(ctx);
    }
  }

  @Action('export_private_key')
  async exportScreen(@Ctx() ctx: Context) {
    await this.walletScreen.exportScreen(ctx, ctx.from.id);
  }

  @Action(/^export_wallet_([1-9A-HJ-NP-Za-km-z]{32,44})$/)
  async exportPrivateKey(@Ctx() ctx: Context) {
    if ('match' in ctx) {
      await this.walletScreen.exportWallet(ctx);
    }
  }
}
