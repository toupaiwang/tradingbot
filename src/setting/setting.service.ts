import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Setting } from './setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletService } from '../wallet/wallet.service';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class SettingService {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async setWallet(userId: number, address: string) {
    const user = await this.userService.findUser(userId); // 查找用户
    const wallet = await this.walletRepository.findOne({
      where: { address },
      relations: { user: true },
    });

    if (wallet.user.id === user.id) {
      await this.settingRepository.upsert(
        { user, wallet },
        { conflictPaths: ['user'], skipUpdateIfNoValuesChanged: true },
      );
    }
  }

  async getWallet(userId: number) {
    return await this.settingRepository
      .findOne({
        where: { user: { id: userId } },
        relations: { user: true, wallet: true },
      })
      .then((setting) => setting?.wallet);
  }

  async setJitoFee(userId: number, jitoFee: number) {
    const user = await this.userService.findUser(userId); // 查找用户
    if (user) {
      // 查找与该用户相关的设置
      const existingSetting = await this.settingRepository.findOneBy({ user });

      // 使用 upsert 插入或更新设置
      await this.settingRepository.upsert(
        {
          user, // 关联的用户
          jitoFee, // 要设置的滑点值
          ...(existingSetting ? { id: existingSetting.id } : {}), // 如果有现有设置，保留其 id 以更新
        },
        ['user'], // 使用 `user` 字段作为冲突字段
      );
    }
  }

  async getJitoFee(userId: number) {
    return this.settingRepository
      .findOneBy({ user: { id: userId } })
      .then((setting) => setting?.jitoFee);
  }

  async setSlippage(userId: number, slippage: number) {
    const user = await this.userService.findUser(userId); // 查找用户
    if (user) {
      // 查找与该用户相关的设置
      const existingSetting = await this.settingRepository.findOneBy({ user });

      // 使用 upsert 插入或更新设置
      await this.settingRepository.upsert(
        {
          user, // 关联的用户
          slippage, // 要设置的滑点值
          ...(existingSetting ? { id: existingSetting.id } : {}), // 如果有现有设置，保留其 id 以更新
        },
        ['user'], // 使用 `user` 字段作为冲突字段
      );
    }
  }

  async getSlippage(userId: number) {
    return this.settingRepository
      .findOneBy({ user: { id: userId } })
      .then((setting) => setting?.slippage);
  }
}
