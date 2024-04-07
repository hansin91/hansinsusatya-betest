import request from 'supertest';
import { app } from '../src/app';
// import { CreateAccountRequest } from '../src/account/account.model';
jest.mock('../src/account/account.schema', () => ({
    AccountModel: {
      create: jest.fn(),
    },
  }));
jest.mock('../src/account/account.service');
jest.mock('../src/user/user.service');
jest.mock('../src/user/user.schema');

describe('Account Controller', () => {
    // let token: string; 
    // beforeAll( async () => {
    //     const user = {
    //         username: "hansin91",
    //         password: "supersecure"
    //     }
    //     const response = await request(app).post('/api/users/login').send(user);
    //     console.log(response)
    // });

    describe('POST /account', () => {
       it('should be able to create a new account', async () => {
            // const account: CreateAccountRequest = { // Fix: Explicitly define the type of account as any
            //     userName: 'test',
            //     accountNumber: '1234567890',
            //     identityNumber: '1234567890',
            //     emailAddress: 'test@gmail.com'
            // };
            // const response = await request(app).post('/account').send(account);
            // console.log(response)
            const user = {
                username: "hansin91",
                password: "supersecure"
            }
            const response = await request(app).post('/api/users/login').send(user);
            console.log(response)
        });
    });
});