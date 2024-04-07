import { createClient } from 'redis';
import { Config } from './config';

type RedisClient = ReturnType<typeof createClient>;
export class Redis {
  private client: RedisClient;
  constructor() {
    this.client = createClient({ url: 'redis://localhost:6379', password: Config.REDIS_PASSWORD });
  }

  public getClient = (): RedisClient => {
    return this.client;
  };

  public connect = async (): Promise<void> => {
    try {
      await this.client.connect();
      console.info(`redis client connected to redis server`);
    } catch (error) {
      console.log('error', 'redis client connection error:', error);
    }
  };
}

export const redisClient: Redis = new Redis();