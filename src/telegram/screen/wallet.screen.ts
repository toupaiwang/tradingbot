import { Injectable } from '@nestjs/common';
import { WalletService } from '../../wallet/wallet.service';
import { Context, Markup } from 'telegraf';
import { SettingService } from '../../setting/setting.service';

@Injectable()
export class WalletScreen {
  constructor(
    private readonly walletService: WalletService,
    private readonly settingService: SettingService,
  ) {}

  async buildWalletScreen(userId: number) {
    const currentWallet = await this.settingService.getWallet(userId);
    let caption = '<b>当前机器人最多支持保存5个钱包</b>';
    caption += '<b>请先生成钱包，再向钱包充值SOL后使用</b>\n\n';
    caption += '<b>为保证钱包安全，当前只支持使用平台生成的钱包</b>\n\n';
    const wallets = await this.walletService.getWallets(userId);
    if (wallets && wallets.length > 0) {
      caption += '\n\n';
      for (const wallet of wallets) {
        caption += `地址: <code>${wallet.address}</code> ${wallet.address === currentWallet.address ? '(当前钱包)' : ''}\n`;
        caption += `余额: <b>${await this.walletService.getBalance(wallet.address)}</b>\n\n`;
      }
    }
    return {
      caption,
      inlineKeyboards: [
        [{ text: '📝 添加钱包 📝', callback_data: 'generate_wallet' }],
        [{ text: '⚙️ 导出私钥 ⚙️', callback_data: 'export_private_key' }],
        [{ text: '⚙️ 解除绑定 ⚙️', callback_data: 'remove_wallet' }],
        [{ text: '📝 切换钱包 📝', callback_data: 'switch_wallet' }],
        [{ text: '❌ 关闭 ❌', callback_data: 'delete_message' }],
      ],
    };
  }

  async getWalletScreen(ctx: Context) {
    const walletScreen = await this.buildWalletScreen(ctx.from.id);
    return await ctx.replyWithHTML(
      walletScreen.caption,
      Markup.inlineKeyboard(walletScreen.inlineKeyboards),
    );
  }

  async generateWallet(ctx: Context, userId: number) {
    const wallets = await this.walletService.getWallets(userId);
    if (wallets && wallets.length >= 5) {
      return await ctx.replyWithHTML(
        '当前机器人最多支持保存5个钱包\n\n请先解除绑定后再生成新的钱包',
      );
    }
    const wallet = await this.walletService.generateWallet(userId);
    const walletScreen = await this.buildWalletScreen(userId);
    await ctx.editMessageText(walletScreen.caption, {
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: walletScreen.inlineKeyboards },
    });
    return await ctx.replyWithHTML(
      `生成钱包成功\n\n地址：<b><code>${wallet.address}</code></b>\n\n请向钱包充值SOL后使用\n 私钥如下:\n<code>${wallet.private_key}</code>`,
      Markup.inlineKeyboard([
        [{ text: '❌ 关闭 ❌', callback_data: 'delete_message' }],
      ]),
    );
  }

  async removeWalletScreen(ctx: Context, userId: number) {
    const wallets = await this.walletService.getWallets(userId);
    await ctx.replyWithHTML(
      `解除绑定将永久删除该钱包\n\n<b>请在解除绑定前导出私钥，以免造成损失</b>\n\n请选择要解除绑定的钱包`,
      Markup.inlineKeyboard(
        wallets.map((wallet) => [
          {
            text: `${wallet.address}`,
            callback_data: `remove_wallet_${wallet.address}`,
          },
        ]),
      ),
    );
  }

  async removeWallet(ctx: Context, userId: number, address: string) {
    const currentWallet = await this.settingService.getWallet(userId);
    if (currentWallet.address == address) {
      return await ctx.replyWithHTML(
        '无法解绑当前使用中的钱包，请先切换钱包后重试',
      );
    }
    const privateKey = await this.walletService.getPrivateKey(address);
    await this.walletService.removeWallet(userId, address);
    await ctx.deleteMessage();
    return await ctx.replyWithHTML(
      `钱包解绑成功\n\n私钥如下\n\n<code>${privateKey}</code>`,
      Markup.inlineKeyboard([
        [{ text: '❌ 关闭 ❌', callback_data: 'delete_message' }],
      ]),
    );
  }

  async switchWalletScreen(ctx: Context, userId: number) {
    const wallets = await this.walletService.getWallets(userId);
    const currentWallet = await this.settingService.getWallet(userId); // current wallet
    return await ctx.replyWithHTML(
      `请选择要切换的钱包\n当前钱包:<b>${currentWallet.address}</b>`,
      Markup.inlineKeyboard(
        wallets.map((wallet) => [
          {
            text: `${wallet.address}`,
            callback_data: `switch_wallet_${wallet.address}`,
          },
        ]),
      ),
    );
  }

  async switchWallet(ctx: Context) {
    const currentWallet = await this.settingService.getWallet(ctx.from.id);
    if ('match' in ctx) {
      if (currentWallet.address == ctx.match[1]) {
        return await ctx.replyWithHTML('当前钱包已经是' + ctx.match[1]);
      }
      try {
        await this.settingService.setWallet(ctx.from.id, ctx.match[1]);
        await ctx.deleteMessage();
        await ctx.replyWithHTML(
          '切换成功\n' + `当前钱包:<b>${ctx.match[1]}</b>`,
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  async exportScreen(ctx: Context, userId: number) {
    const caption = `请选择要导出的钱包`;
    const wallets = await this.walletService.getWallets(userId);
    return await ctx.replyWithHTML(
      caption,
      Markup.inlineKeyboard(
        wallets.map((wallet) => [
          {
            text: `${wallet.address}`,
            callback_data: `export_wallet_${wallet.address}`,
          },
        ]),
      ),
    );
  }

  async exportWallet(ctx: Context) {
    if ('match' in ctx) {
      const privateKey = await this.walletService.getPrivateKey(ctx.match[1]);
      await ctx.deleteMessage();
      await ctx.replyWithHTML(
        `<b>${ctx.match[1]}的私钥如下</b>\n\n<code>${privateKey}</code>`,
        Markup.inlineKeyboard([
          [{ text: '❌ 关闭 ❌', callback_data: 'delete_message' }],
        ]),
      );
    }
  }
}
