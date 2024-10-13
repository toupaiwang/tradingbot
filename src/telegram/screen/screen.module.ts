import { forwardRef, Module } from '@nestjs/common';
import { ScreenService } from './screen.service';
import { ContractScreen } from './contract.screen';
import { UserModule } from '../../user/user.module';
import { WalletModule } from '../../wallet/wallet.module';
import { StartScreen } from './start.screen';
import { SettingModule } from '../../setting/setting.module';
import { WalletScreen } from './wallet.screen';
import { InviteScreen } from './invite.screen';
import { SettingScreen } from './setting.screen';
import { TradeModule } from '../../trade/trade.module';

@Module({
  imports: [
    UserModule,
    WalletModule,
    SettingModule,
    forwardRef(() => TradeModule),
  ],
  providers: [
    ScreenService,
    ContractScreen,
    StartScreen,
    WalletScreen,
    InviteScreen,
    SettingScreen,
    SettingModule,
  ],
  exports: [ScreenService, WalletScreen, InviteScreen, SettingScreen],
})
export class ScreenModule {}
