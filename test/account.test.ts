import request from 'supertest';
import { server } from '../src/app';
import mongoose from 'mongoose';
import { Config } from '../src/config';
import { redisClient } from '../src/redis';
import { AccountModel } from '../src/account/account.schema';
import { UserModel } from '../src/user/user.schema';

jest.mock('../src/redis', () => ({
  redisClient: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    getClient: jest.fn(),
  },
}));

describe('Account Controller', () => {
  let token: string = ''
    beforeAll(async () => {
      await mongoose.connect(`${Config.MONGODB_URI}`);
      await redisClient.connect();
    });

    afterAll(async () => {
      await mongoose.connection.close();
      await redisClient.disconnect();
      server.close();
    });

    beforeEach(async () => {
      await UserModel.deleteMany({ username: 'test'});
      await AccountModel.deleteMany({ userName: 'test'});

      let user: any = {
        username: 'test',
        password: 'test',
        name: 'test',
      }
      let response = await request(server).post('/api/users').send(user);
      user = {
        username: "hansin91",
        password: "supersecure"
      }
      response = await request(server).post('/api/users/login').send(user);
      token = response.body.token;
    });

    describe('GET /account', () => {
      it('should be able to get all accounts', async () => {
        const response = await request(server).get('/api/accounts')
        .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accounts');
      });

      it('should be unauthorized service', async () => {
        const response = await request(server).get('/api/accounts')
        expect(response.status).toBe(401);
        expect(response.error).toBeDefined();
      });

    });

    describe('PUT /account/:accountId', () => {
      it('should be able to update account', async () => {
         const account = {
           userName: "test",
           accountNumber: "3298479234",
           emailAddress: "test@example.com",
           identityNumber: "92374932423"
         }
         let response = await request(server).post('/api/accounts').send(account)
         .set('Authorization', `Bearer ${token}`); 
        const accountId = response.body.id;
        const updatedAccount = {
          userName: "test",
          accountNumber: "3298479233",
          emailAddress: "test1@example.com",
          identityNumber: "92374932420"
        }
        response = await request(server).put(`/api/accounts/${accountId}`).send(updatedAccount)
        .set('Authorization', `Bearer ${token}`); 
        console.log(response.body)
        // expect(response.status).toBe(200);
        // expect(response.body).toHaveProperty('id');
        // expect(response.body).toHaveProperty('userName', 'test');
        // expect(response.body).toHaveProperty('accountNumber', '3298479233');
        // expect(response.body).toHaveProperty('emailAddress');
        // expect(response.body).toHaveProperty('identityNumber'); 
      });

      //  it('should be rejected if request is invalid', async () => {
      //    const account = {
      //      userName: "test",
      //      accountNumber: "3298479234",
      //      emailAddress: "test@example.com",
      //    }
      //    const response = await request(app).post('/api/accounts').send(account)
      //    .set('Authorization', `Bearer ${token}`);
      //    expect(response.status).toBe(400);
      //    expect(response.error).toBeDefined();
      //  });
    });

    describe('POST /account', () => {
       it('should be able to create a new account', async () => {
          const account = {
            userName: "test",
            accountNumber: "3298479234",
            emailAddress: "test@example.com",
            identityNumber: "92374932423"
          }
          const response = await request(server).post('/api/accounts').send(account)
          .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('userName', 'test');
          expect(response.body).toHaveProperty('accountNumber', '3298479234');
          expect(response.body).toHaveProperty('emailAddress');
          expect(response.body).toHaveProperty('identityNumber'); 
        });

        it('should be rejected if request is invalid', async () => {
          const account = {
            userName: "test",
            accountNumber: "3298479234",
            emailAddress: "test@example.com",
          }
          const response = await request(server).post('/api/accounts').send(account)
          .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(400);
          expect(response.error).toBeDefined();
        });

        it('should be unauthorized service', async () => {
          const account = {
            userName: "test",
            accountNumber: "3298479234",
            emailAddress: "test@example.com",
          }
          const response = await request(server).post('/api/accounts').send(account)
          expect(response.status).toBe(401);
          expect(response.error).toBeDefined();
        });

        it('should return invalid token', async () => {
          const account = {
            userName: "test",
            accountNumber: "3298479234",
            emailAddress: "test@example.com",
          }
          const response = await request(server).post('/api/accounts').send(account)
          .set('Authorization', `Bearer e3adadadasdsa`);
          expect(response.status).toBe(401);
          expect(response.body.message).toBe('Invalid token');
        });
    });
});