import { Module } from '@nestjs/common';
import { PumpFunService } from './pump-fun.service';
import { RedisCacheModule } from '../../redis-cache/redis-cache.module';

@Module({
  providers: [PumpFunService],
  imports: [RedisCacheModule],
})
export class PumpFunModule {}
