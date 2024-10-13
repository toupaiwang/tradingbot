import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from '@solana/spl-token';

@Injectable()
export class SolanaService {
  get connection(): Connection {
    return this._connection;
  }

  constructor(private readonly configService: ConfigService) {}

  private _connection = new Connection(
    this.configService.get('SOLANA_ENDPOINT'),
  );

  async getTokenFmtBalance(address: string, mintStr: string) {
    const wallet = new PublicKey(address);
    const mintKey = new PublicKey(mintStr);
    const tokenAccount = await getAssociatedTokenAddress(mintKey, wallet);
    const info = await getAccount(this.connection, tokenAccount);
    const mint = await getMint(this.connection, info.mint);
    return Number(info.amount) / 10 ** mint.decimals;
  }

  async getTokenBalance(address: string, mintStr: string) {
    const wallet = new PublicKey(address);
    const mintKey = new PublicKey(mintStr);
    const tokenAccount = await getAssociatedTokenAddress(mintKey, wallet);
    const info = await getAccount(this.connection, tokenAccount);
    return Number(info.amount);
  }
}
