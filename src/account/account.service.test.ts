import { AccountService } from '../account/account.service';
import { GetAccountRequest, AccountResponse } from '../account/account.model';

describe('AccountService', () => {
  let accountService: AccountService;

  beforeEach(() => {
    accountService = new AccountService();
  });

  describe('get', () => {
    it('should return account data from cache if available', async () => {
      // Mock the redisClient.getClient().get method to return cached data
      const redisClientMock = {
        getClient: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(JSON.stringify({ id: '123', userName: 'testUser' })),
        }),
      };
      const request: GetAccountRequest = { id: '123' };

      const result: AccountResponse = await accountService.get(request);

      expect(redisClientMock.getClient).toHaveBeenCalled();
      expect(redisClientMock.getClient().get).toHaveBeenCalledWith('123');
      expect(result).toEqual({ id: '123', userName: 'testUser' });
    });

    it('should return account data from database if not available in cache', async () => {
      // Mock the redisClient.getClient().get method to return null (no cache)
      // Mock the AccountModel.findById method to return account data
      const redisClientMock = {
        getClient: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(null),
          setEx: jest.fn().mockResolvedValue(undefined),
        }),
      };
      const AccountModelMock = {
        findById: jest.fn().mockResolvedValue({
          _id: '123',
          userName: 'testUser',
          accountNumber: '1234567890',
          emailAddress: 'test@example.com',
          identityNumber: '123456789',
        }),
      };
      const request: GetAccountRequest = { id: '123' };

      const result: AccountResponse = await accountService.get(request);

      expect(redisClientMock.getClient).toHaveBeenCalled();
      expect(redisClientMock.getClient().get).toHaveBeenCalledWith('123');
      expect(AccountModelMock.findById).toHaveBeenCalledWith('123');
      expect(redisClientMock.getClient().setEx).toHaveBeenCalledWith(
        '123',
        3600,
        JSON.stringify({
          id: '123',
          userName: 'testUser',
          accountNumber: '1234567890',
          emailAddress: 'test@example.com',
          identityNumber: '123456789',
        })
      );
      expect(result).toEqual({
        id: '123',
        userName: 'testUser',
        accountNumber: '1234567890',
        emailAddress: 'test@example.com',
        identityNumber: '123456789',
      });
    });

    it('should throw an error if account is not found', async () => {
      // Mock the redisClient.getClient().get method to return null (no cache)
      // Mock the AccountModel.findById method to return null (account not found)
      const redisClientMock = {
        getClient: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(null),
          setEx: jest.fn().mockResolvedValue(undefined),
        }),
      };
      const AccountModelMock = {
        findById: jest.fn().mockResolvedValue(null),
      };
      const request: GetAccountRequest = { id: '123' };

      await expect(accountService.get(request)).rejects.toThrow('Account not found');
      expect(redisClientMock.getClient).toHaveBeenCalled();
      expect(redisClientMock.getClient().get).toHaveBeenCalledWith('123');
      expect(AccountModelMock.findById).toHaveBeenCalledWith('123');
      expect(redisClientMock.getClient().setEx).not.toHaveBeenCalled();
    });

    it('should throw an error if validation fails', async () => {
      // Mock the validationService.validate method to return an error
      const validationServiceMock = {
        validate: jest.fn().mockReturnValue({ error: { message: 'Validation error' } }),
      };
      const request: GetAccountRequest = { id: '123' };

      await expect(accountService.get(request)).rejects.toThrow('Validation error');
      expect(validationServiceMock.validate).toHaveBeenCalledWith('GET', request);
    });

    it('should throw an error if any other error occurs', async () => {
      // Mock the redisClient.getClient().get method to throw an error
      const redisClientMock = {
        getClient: jest.fn().mockReturnValue({
          get: jest.fn().mockRejectedValue(new Error('Redis error')),
        }),
      };
      const request: GetAccountRequest = { id: '123' };

      await expect(accountService.get(request)).rejects.toThrow('Redis error');
      expect(redisClientMock.getClient).toHaveBeenCalled();
      expect(redisClientMock.getClient().get).toHaveBeenCalledWith('123');
    });
  });
});