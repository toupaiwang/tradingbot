import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  txid: string;

  @Column()
  tokenMint: string;

  @Column()
  is_buy: boolean;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ default: 0 })
  amount: number;

  @Column({ default: 0 })
  solAmount: number;

  @Column({ default: 0 })
  price: number;

  @ManyToOne(() => User, (user) => user.trades)
  user: User;
}
