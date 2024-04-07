import dotenv from 'dotenv';

dotenv.config();

export class Config {
  static readonly PORT: number = Number(process.env.PORT) || 3000;
  static readonly MONGODB_URI: string = process.env.MONGODB_URI as string;
  static readonly SECRET_KEY: string = process.env.SECRET_KEY as string;
  static readonly REDIS_PASSWORD: string = process.env.REDIS_PASSWORD as string;
}
