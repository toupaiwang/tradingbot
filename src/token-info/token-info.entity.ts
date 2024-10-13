import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TokenInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mint: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  supply: number;

  @Column()
  decimals: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
