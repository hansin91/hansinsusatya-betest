import { ValidationService } from '../common/validation.service';
import {
  AccountResponse,
  CreateAccountRequest,
  DeleteAccountRequest,
  GetAccountRequest,
  SearchAccountRequest,
  UpdateAccountRequest,
} from './account.model';
import { AccountValidation } from './account.validation';
import { AccountModel } from './account.schema';
import { redisClient } from '../redis';

export class AccountService {
  private validationService: ValidationService;
  constructor() {
    this.validationService = new ValidationService();
  }

  search = async (request: SearchAccountRequest) => {
    try {
      const searchRequest = this.validationService.validate(
        AccountValidation.SEARCH,
        request,
      );
      if (searchRequest.error) {
        throw new Error(searchRequest.error.message);
      }
      const conditions = [];
      const { userName, accountNumber, emailAddress, identityNumber } =
        searchRequest.value;
      if (userName) {
        conditions.push({ userName: { $regex: userName, $options: 'i' } });
      }
      if (accountNumber) {
        conditions.push({
          accountNumber: { $regex: accountNumber, $options: 'i' },
        });
      }
      if (emailAddress) {
        conditions.push({
          emailAddress: { $regex: emailAddress, $options: 'i' },
        });
      }
      if (identityNumber) {
        conditions.push({
          identityNumber: { $regex: identityNumber, $options: 'i' },
        });
      }

      const skip = (searchRequest.value.page - 1) * searchRequest.value.size;
      const limit = searchRequest.value.size;

      let accounts = [];
      let total = 0;
      if (conditions.length) {
        accounts = await AccountModel.find({ $or: conditions })
          .skip(skip)
          .limit(limit);
        total = await AccountModel.countDocuments({ $or: conditions });
      } else {
        accounts = await AccountModel.find().skip(skip).limit(limit);
        total = await AccountModel.countDocuments();
      }
      return {
        accounts: accounts.map((account) => ({
          id: account._id.toString(),
          userName: account.userName,
          accountNumber: account.accountNumber,
          emailAddress: account.emailAddress,
          identityNumber: account.identityNumber,
        })),
        paging: {
          currentPage: searchRequest.value.page,
          limit: searchRequest.value.limit,
          totalPage: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  get = async (request: GetAccountRequest): Promise<AccountResponse> => {
    try {
        const getAccountRequest = this.validationService.validate(AccountValidation.GET, request);
        if (getAccountRequest.error) {
          throw new Error(getAccountRequest.error.message);
        }

        const cache = await redisClient.getClient().get(getAccountRequest.value.id);
        if (cache) {
          console.log('cache');
          return JSON.parse(cache);
        }
        const account = await AccountModel.findById(getAccountRequest.value.id);
        if (!account) {
          throw new Error('Account not found');
        }
        const data = {
          id: account._id.toString(),
          userName: account.userName,
          accountNumber: account.accountNumber,
          emailAddress: account.emailAddress,
          identityNumber: account.identityNumber,
        }
        await redisClient.getClient().setEx(getAccountRequest.value.id, 3600, JSON.stringify(data));

        return data;

    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  delete = async (request: DeleteAccountRequest) => {
    try {
      const deleteAccountRequest = this.validationService.validate(
        AccountValidation.DELETE,
        request,
      );
      if (deleteAccountRequest.error) {
        throw new Error(deleteAccountRequest.error.message);
      }
      const account = await AccountModel.findByIdAndDelete(
        deleteAccountRequest.value.id,
      );
      await redisClient.getClient().del(deleteAccountRequest.value.id);
      if (!account) {
        throw new Error('Account not found');
      }
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  update = async (request: UpdateAccountRequest): Promise<AccountResponse> => {
    try {
      const updateAccountRequest = this.validationService.validate(
        AccountValidation.UPDATE,
        request,
      );
      if (updateAccountRequest.error) {
        throw new Error(updateAccountRequest.error.message);
      }
      const account = await AccountModel.findByIdAndUpdate(
        request.id,
        updateAccountRequest.value,
        { new: true },
      );
      if (!account) {
        throw new Error('Account not found');
      }
      const data = {
        id: account._id.toString(),
        userName: account.userName,
        accountNumber: account.accountNumber,
        emailAddress: account.emailAddress,
        identityNumber: account.identityNumber,
      }
      await redisClient.getClient().setEx(request.id, 3600, JSON.stringify(data));
      return data
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  create = async (request: CreateAccountRequest): Promise<AccountResponse> => {
    try {
      const createAccountRequest = this.validationService.validate(
        AccountValidation.CREATE,
        request,
      );
      if (createAccountRequest.error) {
        throw new Error(createAccountRequest.error.message);
      }

      let account = await AccountModel.findOne({
        accountNumber: createAccountRequest.value.accountNumber,
      });
      if (account) {
        throw new Error('Account number already exists');
      }

      account = await AccountModel.findOne({
        emailAddress: createAccountRequest.value.emailAddress,
      });
      if (account) {
        throw new Error('Email address already exists');
      }

      account = await AccountModel.findOne({
        identityNumber: createAccountRequest.value.identityNumber,
      });
      if (account) {
        throw new Error('Identity number already exists');
      }
      account = (await AccountModel.create([createAccountRequest.value]))[0];
      return {
        id: account._id.toString(),
        userName: account.userName,
        accountNumber: account.accountNumber,
        emailAddress: account.emailAddress,
        identityNumber: account.identityNumber,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
}
