import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LockService {
  private readonly redis: Redis;
  private readonly ACQUIRE_LUA = `
  local ok = redis.call('SET', KEYS[1], ARGV[1], 'NX', 'PX', ARGV[2])
  if ok then return 1 else return 0 end
`;
  private readonly RELEASE_LUA = `
  if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
  else
    return 0
  end
`;

  constructor(private readonly configService: ConfigService) {
    const host = configService.getOrThrow('REDIS_HOST');
    const port = configService.getOrThrow('REDIS_PORT');

    this.redis = new Redis({
      host,
      port,
    });
  }

  async acquire(key: string, userId: string) {
    let lock = await this.redis.eval(this.ACQUIRE_LUA, 1, key, userId, 5000);
    while (!lock) {
      lock = await this.redis.eval(this.ACQUIRE_LUA, 1, key, userId, 5000);
    }
    return lock === 1 ? userId : undefined;
  }

  async release(key: string, userId: string) {
    const result = await this.redis.eval(this.RELEASE_LUA, 1, key, userId);
  }
}
