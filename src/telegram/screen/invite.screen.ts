import { Injectable } from '@nestjs/common';
import { Context, Markup } from 'telegraf';
import { UserService } from '../../user/user.service';
import { SettingService } from '../../setting/setting.service';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

@Injectable()
export class InviteScreen {
  constructor(
    private readonly userService: UserService,
    private readonly settingService: SettingService,
  ) {}

  async buildInviteScreen(ctx: Context) {
    const userId = ctx.from.id;
    const childrenCount = await this.userService.getChildrenCount(userId);
    const currentWallet = await this.settingService.getWallet(userId);
    const referralCode =
      await this.userService.getOrGenerateReferralCode(userId);
    const totalReferralBalance =
      (await this.userService.getReferralBalance(userId)) / LAMPORTS_PER_SOL;
    const withdrawableBalance =
      (await this.userService.getWithdrawBalance(userId)) / LAMPORTS_PER_SOL;
    const caption =
      `🔗 邀请链接: <b>https://t.me/khetzoo_bot?start=${referralCode}</b>\n` +
      `👥 累计邀请：<b>${childrenCount}人</b>\n` +
      `💳 收款地址: <b><code>${currentWallet.address}</code></b>\n` +
      `💵 总邀请奖励: <b>${totalReferralBalance}</b> SOL\n` +
      `💵 当前已提现: <b>${withdrawableBalance}</b> SOL`;

    return {
      caption,
      inline_keyboards: [
        [
          { text: '🔄 刷新 🔄', callback_data: 'invite_refresh' },
          { text: '❌ 关闭 ❌', callback_data: 'delete_message' },
        ],
      ],
    };
  }

  async getInviteScreen(ctx: Context) {
    const screen = await this.buildInviteScreen(ctx);
    return ctx.replyWithHTML(
      screen.caption,
      Markup.inlineKeyboard(screen.inline_keyboards),
    );
  }

  async refreshInviteScreen(ctx: Context) {
    const screen = await this.buildInviteScreen(ctx);
    try {
      return ctx.editMessageText(screen.caption, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: screen.inline_keyboards,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
