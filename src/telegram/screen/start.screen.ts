import { Injectable } from '@nestjs/common';
import { WalletService } from '../../wallet/wallet.service';
import { UserService } from '../../user/user.service';
import { SettingService } from '../../setting/setting.service';

@Injectable()
export class StartScreen {
  constructor(
    private readonly walletService: WalletService,
    private readonly userService: UserService,
    private readonly settingService: SettingService,
  ) {}

  async getStartScreen(userId: number) {
    const user = await this.userService.findUser(userId);
    const wallet = await this.settingService.getWallet(userId);
    const caption =
      `👋 欢迎使用 kheowzoo 交易 bot 👋\n` +
      `👤 用户: <b>${user.first_name}</b>\n` +
      `💳 钱包: <b>${wallet.address}</b>` +
      `💳 余额: <b>${await this.walletService.getBalance(wallet.address)} SOL</b>\n` +
      `👤 邀请链接: <b>https://t.me/khetzoo_bot?start=${user.referral_code}</b>\n` +
      `现在邀请你的朋友加入可获取25%交易手续费返佣` +
      `发送合约即可开始交易`;
    return {
      caption,
      inline_keyboards: [
        [{ text: '📝 钱包 📝', callback_data: 'wallet' }],
        [{ text: '⚙️ 设置 ⚙️', callback_data: 'setting' }],
        [{ text: '👥 邀请 👥', callback_data: 'invite' }],
        [{ text: '❌ 关闭 ❌', callback_data: 'delete_message' }],
      ],
    };
  }
}
