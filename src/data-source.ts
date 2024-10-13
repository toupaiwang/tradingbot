import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { TokenInfo } from './token-info/token-info.entity';
import { User } from './user/user.entity';
import { Wallet } from './wallet/wallet.entity';
import { Trade } from './trade/trade.entity';
import { Message } from './message/message.entity';
import { Setting } from './setting/setting.entity';

config(); // 加载 .env 文件中的环境变量

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [TokenInfo, User, Wallet, Trade, Message, Setting],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
