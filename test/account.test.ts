import request from 'supertest';
import { app } from '../src/app';
import mongoose from 'mongoose';
import { Config } from '../src/config';
import { redisClient } from '../src/redis';
import { AccountModel } from '../src/account/account.schema';
import { UserModel } from '../src/user/user.schema';

jest.mock('../src/redis', () => ({
  redisClient: {
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
}));

describe('Account Controller', () => {
  let token: string = ''
    beforeAll( async () => {
      await UserModel.deleteMany({ username: 'test'});
      await AccountModel.deleteMany({ userName: 'test'});
      await mongoose.connect(`${Config.MONGODB_URI}`);
      await redisClient.connect();
      const user = {
        username: "hansin91",
        password: "supersecure"
      }
      const response = await request(app).post('/api/users/login').send(user);
      token = response.body.token;
    });

    afterAll(async () => {
      await mongoose.connection.close();
      await redisClient.disconnect();
    });

    describe('POST /account', () => {
       it('should be able to create a new account', async () => {
          const account = {
            userName: "test",
            accountNumber: "3298479234",
            emailAddress: "test@example.com",
            identityNumber: "92374932423"
          }
          const response = await request(app).post('/api/accounts').send(account)
          .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('userName', 'test');
          expect(response.body).toHaveProperty('accountNumber', '3298479234');
          expect(response.body).toHaveProperty('emailAddress');
          expect(response.body).toHaveProperty('identityNumber'); 
        });
    });
});