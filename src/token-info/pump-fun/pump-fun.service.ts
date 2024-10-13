import { Injectable } from '@nestjs/common';
import { PumpFunResponseDto } from './pump-fun-response.dto';
import { RedisCacheService } from '../../redis-cache/redis-cache.service';

@Injectable()
export class PumpFunService {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  async getPumpInfo(mintStr: string): Promise<PumpFunResponseDto> {
    const cacheKey = `pump_info_${mintStr}`;
    const cachedData =
      await this.redisCacheService.get<PumpFunResponseDto>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const url = `https://frontend-api.pump.fun/coins/${mintStr}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://www.pump.fun/',
        Origin: 'https://www.pump.fun',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'If-None-Match': 'W/"43a-tWaCcS4XujSi30IFlxDCJYxkMKg"',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      await this.redisCacheService.set(cacheKey, data);
      return data;
    } else if (response.status === 500) {
      throw new Error('Not pump token');
    } else {
      throw new Error('pump fun api error');
    }
  }

  async isPump(mintStr: string): Promise<boolean> {
    try {
      const data = await this.getPumpInfo(mintStr);
      return !data.complete;
    } catch (e: Error | any) {
      if (e.message === 'Not pump token') {
        return false;
      }
      throw e;
    }
  }
}
