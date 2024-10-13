import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import bs58 from 'bs58';
import { Wallet } from './wallet.entity';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async generateWallet(userId: number) {
    const user = await this.userService.findUser(userId);
    if (user) {
      if (user.wallets && user.wallets.length >= 5) return;
      const newKeypair = Keypair.generate();
      const newWallet = this.walletRepository.create({
        address: newKeypair.publicKey.toBase58(),
        private_key: bs58.encode(newKeypair.secretKey),
        balance: 0,
        user: user,
      });
      return await this.walletRepository.save(newWallet);
    }
  }

  async findWalletByAddress(address: string) {
    return this.walletRepository.findOneBy({ address });
  }

  async removeWallet(userId: number, address: string) {
    const user = await this.userService.findUser(userId);
    if (user) {
      await this.walletRepository.delete({ address, user });
    }
  }

  async getPrivateKey(address: string) {
    const wallet = await this.walletRepository.findOneBy({ address });
    if (wallet) {
      return wallet.private_key;
    }
  }

  async getWallets(userId: number) {
    const user = await this.userService.findUser(userId);
    if (user) {
      return this.walletRepository.find({ where: { user: user } });
    }
  }

  async getBalance(address: string) {
    const connection = new Connection(
      this.configService.get('SOLANA_ENDPOINT'),
      'confirmed',
    );
    const balance = await connection.getBalance(new PublicKey(address));
    return balance / LAMPORTS_PER_SOL;
  }

  async refreshUserWalletsBalance(userId: number) {
    const user = await this.userService.findUser(userId);
    if (user) {
      const wallets = await this.getWallets(userId);
      for (const wallet of wallets) {
        wallet.balance = await this.getBalance(wallet.address);
        await this.walletRepository.save(wallet);
      }
    }
  }
}
