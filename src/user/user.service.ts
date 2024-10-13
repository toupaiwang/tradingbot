import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(
    userId: number,
    firstName: string,
    lastName?: string,
    referer_code?: string,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    let parent: User = null;
    if (referer_code) {
      parent = await this.userRepository.findOneBy({
        referral_code: referer_code,
      });
    }
    if (!user) {
      const newUser = this.userRepository.create({
        id: userId,
        first_name: firstName,
        last_name: lastName ? lastName : null,
        parent: parent ? parent : null,
      });
      await this.userRepository.save(newUser);
    }
  }

  async findUser(userId: number) {
    return await this.userRepository.findOneBy({ id: userId });
  }

  async setReferParent(userId: number, referral_code: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      if (user.parent) return;
      const parent = await this.userRepository.findOneBy({
        referral_code,
      });
      if (parent) {
        user.parent = parent;
        await this.userRepository.save(user);
      } else {
        return;
      }
    } else {
      return;
    }
  }

  async getOrGenerateReferralCode(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      if (user.referral_code) return user.referral_code;
      const newCode = this.generateCode();
      user.referral_code = newCode;
      await this.userRepository.save(user);
      return newCode;
    }
  }

  // get children count
  async getChildrenCount(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const children = await this.userRepository.find({
      where: { parent: user },
    });
    if (children) {
      return children.length;
    } else return 0;
  }

  // It's for adding parent referral balance
  async addReferralBalance(userId: number, amount: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { parent: true },
    });
    const parent = await this.userRepository.findOneBy({
      id: user.parent.id,
    });
    console.log(parent);
    if (parent) {
      parent.referral_balance += amount;
      await this.userRepository.save(parent);
    }
  }

  async getReferralBalance(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      return user.referral_balance;
    }
  }

  async addWithdrawBalance(userId: number, amount: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      user.withdraw_balance += amount;
      await this.userRepository.save(user);
    }
  }

  async getWithdrawBalance(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      return user.withdraw_balance;
    }
  }

  private generateCode() {
    const str =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referral_code = '';
    for (let i = 0; i < 10; i++) {
      referral_code += str.charAt(Math.floor(Math.random() * str.length));
    }
    return referral_code;
  }
}
