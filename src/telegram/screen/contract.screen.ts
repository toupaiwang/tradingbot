import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { WalletService } from '../../wallet/wallet.service';
import { SettingService } from '../../setting/setting.service';
import { SolanaService } from '../../trade/solana.service';
import { TradeService } from '../../trade/trade.service';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

@Injectable()
export class ContractScreen {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private readonly settingService: SettingService,
    private readonly solanaService: SolanaService,
    private readonly tradeService: TradeService,
  ) {}

  async getContractScreen(data: any, userId: number) {
    const caption = await this.buildCaption(
      data.name,
      data.symbol,
      data.mint,
      data.price,
      data.supply,
      userId,
    );

    return {
      caption,
      inline_keyboards: await this.inline_keyboards(userId),
    };
  }

  async buildCaption(
    name: string,
    symbol: string,
    mint: string,
    price: number,
    supply: number,
    userId: number,
  ) {
    const mc = price * supply;
    const currentWallet = await this.settingService.getWallet(userId);
    const walletBalance = await this.walletService.getBalance(
      currentWallet.address,
    );
    const currentTokenBalance = await this.solanaService.getTokenFmtBalance(
      currentWallet.address,
      mint,
    );
    const profit = await this.tradeService.calculateProfit(userId, mint);
    let caption = '';
    caption +=
      `🌳 代币: <b>${name ?? 'undefined'} (${symbol ?? 'undefined'})</b> ` +
      `<code>${mint}</code>\n\n`;

    caption +=
      `💲 价格(USD): <b>${price}</b>\n` + `📊 市值(USD): <b>${mc}</b>\n\n`;

    caption += `💳 钱包: <b>${currentWallet.address}</b>\n`;
    caption += `💳 SOL 余额: <b>${walletBalance} SOL</b>\n`;
    caption += `💳 ${name} 余额: <b>${currentTokenBalance} ${symbol}</b>\n\n`;
    caption += `💲 持仓价值: <b>$${(currentTokenBalance * price).toFixed(2)}</b>`;
    caption += `💲 当前盈利: <b>${profit / LAMPORTS_PER_SOL} SOL</b>`;
    return caption;
  }

  async inline_keyboards(userId: number): Promise<InlineKeyboardButton[][]> {
    const wallets = await this.walletService.getWallets(userId);
    return [
      [{ text: '🖼 生成收益图', callback_data: 'pnl_card' }],
      wallets
        ? [
            ...wallets.map((wallet) => {
              return {
                text: wallet.address,
                callback_data: 'change_wallet_' + wallet.address,
              };
            }),
          ]
        : [],
      [{ text: '🟢 买', callback_data: 'nothing' }],
      [
        { text: '买 0.1 SOL', callback_data: 'buy_0.1' },
        { text: '买 0.5 SOL', callback_data: 'buy_0.5' },
      ],
      [
        { text: '买 1 SOL', callback_data: 'buy_1' },
        { text: '买 5 SOL', callback_data: 'buy_5' },
      ],
      [{ text: '买 X SOL', callback_data: 'buy_custom' }],
      [{ text: '🔴 卖', callback_data: 'nothing' }],
      [
        { text: '卖 10%', callback_data: 'sell_10' },
        { text: '卖 20%', callback_data: 'sell_20' },
      ],
      [
        { text: '卖一半', callback_data: 'sell_50' },
        { text: '全卖', callback_data: 'sell_100' },
      ],
      [{ text: '卖 X %', callback_data: 'sell_custom' }],
      [
        { text: '🔄 刷新', callback_data: 'contract_refresh' },
        { text: '❌ 关闭', callback_data: 'delete_message' },
      ],
    ];
  }
}
