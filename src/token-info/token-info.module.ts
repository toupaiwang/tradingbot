import { Module } from '@nestjs/common';
import { PumpFunModule } from './pump-fun/pump-fun.module';
import { TokenInfoService } from './token-info.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenInfo } from './token-info.entity';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { PumpFunService } from './pump-fun/pump-fun.service';

@Module({
  imports: [
    PumpFunModule,
    TypeOrmModule.forFeature([TokenInfo]),
    RedisCacheModule,
  ],
  providers: [TokenInfoService, PumpFunService],
})
export class TokenInfoModule {}
