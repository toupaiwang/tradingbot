import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SettingService } from './setting.service';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @MessagePattern({ cmd: 'setSlippage' })
  async setSlippage(data: { userId: number; slippage: number }) {
    await this.settingService.setSlippage(data.userId, data.slippage);
  }
}
