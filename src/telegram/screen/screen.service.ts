import { Injectable } from '@nestjs/common';
import { ContractScreen } from './contract.screen';
import { StartScreen } from './start.screen';

@Injectable()
export class ScreenService {
  constructor(
    private readonly contractScreen: ContractScreen,
    private readonly startScreen: StartScreen,
  ) {}

  getContractScreen(data: any, userId: number) {
    return this.contractScreen.getContractScreen(data, userId);
  }

  getStartScreen(userId: number) {
    return this.startScreen.getStartScreen(userId);
  }
}
