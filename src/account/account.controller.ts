import { Request, Response } from 'express';
import { AccountService } from './account.service';
import { StatusCodes } from 'http-status-codes';
import { SearchAccountRequest } from './account.model';

class AccountController {
  private accountService: AccountService;
  constructor() {
    this.accountService = new AccountService();
  }

  get = async (req: Request, res: Response) => {  
    try {
      const account = await this.accountService.get({ id: req.params.accountId });
      return res.status(StatusCodes.OK).json(account);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  };

  search = async (req: Request, res: Response) => {
    try {
      const {
        username,
        account_number,
        email_address,
        identity_number,
        page,
        size,
      } = req.query;
      const request: SearchAccountRequest = {
        userName: username as string,
        accountNumber: account_number as string,
        emailAddress: email_address as string,
        identityNumber: identity_number as string,
        page: Number(page) || 1,
        size: Number(size) || 30,
      };
      const result = await this.accountService.search(request);
      return res.status(StatusCodes.CREATED).json(result);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.accountService.delete({ id: req.params.accountId });
      return res.status(StatusCodes.OK).json({ message: 'Account deleted' });
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const account = await this.accountService.create(req.body);
      return res.status(StatusCodes.CREATED).json(account);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      req.body.id = req.params.accountId;
      const account = await this.accountService.update(req.body);
      return res.status(StatusCodes.OK).json(account);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  };
}

export const accountController = new AccountController();
