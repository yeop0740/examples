import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LockService {
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    const host = configService.getOrThrow('REDIS_HOST');
    const port = configService.getOrThrow('REDIS_PORT');

    this.redis = new Redis({
      host,
      port,
    });
  }

  async acquire(key: string) {
    while (true) {
      const lock = await this.redis.set(key, 1, 'PX', 5000, 'NX');
      if (lock === 'OK') {
        return key;
      }
    }
  }

  async release(key: string) {
    await this.redis.del(key);
  }
}
