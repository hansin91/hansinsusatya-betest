import mongoose from 'mongoose';
import { Config } from './config';

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${Config.MONGODB_URI}`);
    console.info('Users service successfully connected to database');
  } catch (error) {
    console.log(
      'error',
      'UsersService databaseConnection() method error:',
      error,
    );
  }
};

export { databaseConnection };
