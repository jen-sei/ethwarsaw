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
    return await this.redis.hExists(userKey, 'isRegistered');
  }

  async registerUser(userAddress: string): Promise<boolean> {
    const chatSecret = randomBytes(48)
      .toString('base64')
      .replaceAll(/[+\/]/g, '');
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

  async encounterGameExists(encounterId: string): Promise<boolean> {
    return (await this.redis.exists(`game:${encounterId}`)) === 1;
  }

  async getEncounterGame(encounterId: string): Promise<string[]> {
    return await this.redis.hmGet(`game:${encounterId}`, [
      'status',
      'answer',
      'correctAnswer',
    ]);
  }

  async submitEncounterGameAnswer(
    encounterId: string,
    answerIndex: string,
  ): Promise<void> {
    const [_, __, correctAnswer] = await this.getEncounterGame(encounterId);
    const isAnswerCorrect = answerIndex === correctAnswer;

    await this.redis.hSet(`game:${encounterId}`, {
      answer: answerIndex,
      status: isAnswerCorrect ? 'success' : 'failed',
    });
  }

  async publishNewGameAnswer(encounterId: string) {
    await this.redis.publish('newGameAnswer', encounterId);
  }

  async publishNewUser(userAddress: string) {
    await this.redis.publish('newUser', userAddress);
  }
}
