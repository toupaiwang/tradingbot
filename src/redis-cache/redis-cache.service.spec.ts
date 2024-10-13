import { Test, TestingModule } from '@nestjs/testing';
import { RedisCacheService } from './redis-cache.service';
import { CACHE_MANAGER, CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { Cache } from 'cache-manager';

describe('RedisCacheService', () => {
  let service: RedisCacheService;
  let cacheManager: Cache;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisCacheService],
      imports: [
        ConfigModule.forRoot({}),
        CacheModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (config: ConfigService) => {
            const store = await redisStore({
              socket: {
                host: config.get<string>('REDIS_HOST'),
                port: config.get<number>('REDIS_PORT'),
              },
              password: config.get<string>('REDIS_PASSWORD'),
              ttl: 600,
            });
            console.log(config.get<string>('REDIS_HOST'));
            return {
              store: store as unknown as CacheStore,
            };
          },
          inject: [ConfigService],
        }),
      ],
    }).compile();

    cacheManager = module.get<Cache>(CACHE_MANAGER);
    service = module.get<RedisCacheService>(RedisCacheService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should get from cache', async () => {
    console.log(cacheManager.store);
    await service.set('key', 'value', 6);
    expect(await cacheManager.get('key')).toEqual('value');
  });

  it('should get env', async () => {
    expect(configService.get<string>('REDIS_HOST')).toEqual('localhost');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
