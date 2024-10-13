import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Setting } from '../setting/setting.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  address: string;

  @Column()
  balance: number;

  @Column()
  private_key: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @OneToOne(() => Setting, (setting) => setting.wallet)
  setting: Setting;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
