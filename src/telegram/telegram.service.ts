import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Context, Markup, Telegraf } from 'telegraf';
import { TokenInfoService } from '../token-info/token-info.service';
import { MessageService } from '../message/message.service';
import { ScreenService } from './screen/screen.service';
import { WalletService } from '../wallet/wallet.service';
import { SettingService } from '../setting/setting.service';
import { TradeService } from '../trade/trade.service';
import { InjectBot } from 'nestjs-telegraf';

@Injectable()
export class TelegramService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenInfoService: TokenInfoService,
    private readonly messageService: MessageService,
    private readonly screenService: ScreenService,
    private readonly walletService: WalletService,
    private readonly settingService: SettingService,
    private readonly tradeService: TradeService,
    @InjectBot() private bot: Telegraf<any>,
  ) {}

  private getStartPayload(messageText: string) {
    const args = messageText.split(' '); // 分割文本，以空格分隔命令和参数

    if (args.length > 1) {
      // 获取第二部分作为参数
      return args[1];
    } else {
      return null;
    }
  }

  async sendMessage(userId: number, text: string) {
    await this.bot.telegram.sendMessage(userId, text, { parse_mode: 'HTML' });
  }

  async start(ctx: Context) {
    const userId = ctx.from.id;
    // 若没有用户存在，则创建用户，并生成钱包
    if (!(await this.userService.findUser(userId))) {
      const referer_code = this.getStartPayload(ctx.text) || null;
      const firstName = ctx.from.first_name;
      const lastName = ctx.from.last_name || null;
      if (referer_code) {
        await this.userService.createUser(
          userId,
          firstName,
          lastName,
          referer_code,
        );
      } else {
        await this.userService.createUser(userId, firstName, lastName);
      }

      // 生成并保存默认钱包
      const wallet = await this.walletService.generateWallet(userId);
      await this.settingService.setWallet(userId, wallet.address);
    }
    await this.userService.getOrGenerateReferralCode(userId);
    // 回复默认屏
    const startScreen = await this.screenService.getStartScreen(ctx.from.id);
    await ctx.replyWithHTML(
      startScreen.caption,
      Markup.inlineKeyboard(startScreen.inline_keyboards),
    );
  }

  async getTokenInfo(ctx: Context) {
    // 获取token
    const data = await this.tokenInfoService.getFullTokenInfo(ctx.text);
    const screen = await this.screenService.getContractScreen(
      data,
      ctx.from.id,
    );
    const msg = await ctx.replyWithHTML(
      screen.caption,
      Markup.inlineKeyboard(screen.inline_keyboards),
    );
    await this.messageService.create(ctx.from.id, msg.message_id, ctx.text);
  }

  async contractRefresh(ctx: Context) {
    const msg = await this.messageService.getData(ctx.from.id, ctx.msgId);
    const data = await this.tokenInfoService.getFullTokenInfo(msg.mint);
    const screen = await this.screenService.getContractScreen(
      data,
      ctx.from.id,
    );
    try {
      await ctx.editMessageText(screen.caption, {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: screen.inline_keyboards },
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async baseBuy(ctx, userId: number, mint: string, amount: number) {
    await ctx.reply(`购买${amount}SOL的代币${mint}`);
    await this.tradeService.trade(userId, amount, mint, true);
  }

  async buy(ctx: Context, amount: number) {
    const msg = await this.messageService.getData(ctx.from.id, ctx.msgId);
    await this.baseBuy(ctx, ctx.from.id, msg.mint, amount);
  }

  async buyCustom(ctx: Context) {
    const msg = await ctx.reply(
      '请输入你要购买的数量(SOL)',
      Markup.forceReply(),
    );
    const currentMsg = await this.messageService.getData(
      ctx.from.id,
      ctx.msgId,
    );
    await this.messageService.create(
      ctx.from.id,
      msg.message_id,
      currentMsg.mint,
      true,
    );
  }

  async sell(ctx: Context, amount: any) {
    const msg = await this.messageService.getData(ctx.from.id, ctx.msgId);
    await this.baseSell(ctx, ctx.from.id, msg.mint, amount);
  }

  private async baseSell(ctx: Context, id: number, mint: string, amount: any) {
    await ctx.reply(`卖出${amount}%的${mint}`);
    await this.tradeService.trade(id, amount, mint, false);
  }

  async sellCustom(ctx: Context) {
    const msg = await ctx.reply('请输入你要卖出的比例(%)', Markup.forceReply());
    const currentMsg = await this.messageService.getData(
      ctx.from.id,
      ctx.msgId,
    );
    await this.messageService.create(
      ctx.from.id,
      msg.message_id,
      currentMsg.mint,
      false,
    );
  }

  async handleAmount(ctx: Context) {
    if ('reply_to_message' in ctx.message) {
      const replyToMessage = ctx.message.reply_to_message;
      const currentMsg = await this.messageService.getData(
        ctx.from.id,
        replyToMessage.message_id,
      );
      if (!currentMsg.isBuy === undefined) {
        console.log(undefined);
        return;
      } else if (currentMsg.isBuy) {
        await this.baseBuy(ctx, ctx.from.id, currentMsg.mint, Number(ctx.text));
      } else {
        if (Number(ctx.text) > 100) {
          return await ctx.reply('比例不能超过100');
        }
        await this.baseSell(
          ctx,
          ctx.from.id,
          currentMsg.mint,
          Number(ctx.text),
        );
      }
    }
  }

  async changeWallet(ctx: Context) {
    if ('match' in ctx) {
      await this.settingService.setWallet(ctx.from.id, ctx.match[1]);
      await this.contractRefresh(ctx);
    }
  }
}
