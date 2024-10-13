import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Wallet } from '../wallet/wallet.entity';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.setting)
  @JoinColumn()
  user: User;

  @Column({ default: 30 })
  slippage: number; // in percentage

  @Column({ default: 500000 })
  jitoFee: number;

  @OneToOne(() => Wallet, (wallet) => wallet.setting)
  @JoinColumn()
  wallet: Wallet;
}
