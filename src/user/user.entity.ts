import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';
import { Trade } from '../trade/trade.entity';
import { Message } from '../message/message.entity';
import { Setting } from '../setting/setting.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @ManyToOne(() => User, (user) => user.children)
  parent: User;

  @OneToMany(() => User, (user) => user.parent)
  children: User[];

  @Column({ unique: true, nullable: true })
  referral_code: string;

  @OneToMany(() => Trade, (trade) => trade.user)
  trades: Trade[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToOne(() => Setting, (setting) => setting.user)
  setting: Setting;

  @Column({ default: 0 })
  referral_balance: number;

  @Column({ default: 0 })
  withdraw_balance: number;
}
