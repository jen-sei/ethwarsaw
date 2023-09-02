import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { randomBytes } from 'crypto';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  async userExists(userAddress: string): Promise<boolean> {
    const userKey = `user:${userAddress}`;
    return this.redis.hExists(userKey, 'isRegistered');
  }

  async registerUser(userAddress: string): Promise<boolean> {
    const chatSecret = randomBytes(48).toString('hex');
    const userKey = `user:${userAddress}`;
    const userChatSecretKey = `userChatSecret:${chatSecret}`;
    const userExists = await this.redis.hExists(userKey, 'isRegistered');

    if (userExists) {
      return false;
    }

    await this.redis.hSet(userKey, {
      isRegistered: 'true',
      address: userAddress,
      chatSecret,
    });

    await this.redis.hSet(userChatSecretKey, {
      address: userAddress,
    });

    return true;
  }

  async getUserChatSecret(userAddress: string): Promise<string | undefined> {
    const userKey = `user:${userAddress}`;
    return await this.redis.hGet(userKey, 'chatSecret');
  }
}
