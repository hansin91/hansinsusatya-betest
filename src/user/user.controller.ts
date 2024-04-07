import { Request, Response } from 'express';
import { UserService } from './user.service';
import { StatusCodes } from 'http-status-codes';

class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.register(req.body);
      return res.status(StatusCodes.CREATED).json(user);
    } catch (error: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const data = await this.userService.login(req.body);
      res.status(StatusCodes.OK).json(data);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  };
}

export const userController = new UserController();
