import { Action, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { InviteScreen } from './screen/invite.screen';

@Update()
export class InviteUpdate {
  constructor(private readonly inviteScreen: InviteScreen) {}

  @Action('invite')
  async invite(@Ctx() ctx: Context) {
    await this.inviteScreen.getInviteScreen(ctx);
  }

  @Action('invite_refresh')
  async refresh(@Ctx() ctx: Context) {
    await this.inviteScreen.refreshInviteScreen(ctx);
  }
}
