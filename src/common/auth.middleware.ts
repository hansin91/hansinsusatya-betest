import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Config } from '../config';
import { UserModel } from '@user/user.schema';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
  }

  jwt.verify(token, Config.SECRET_KEY, async (err: any, decoded: any) => {
    if (err) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Invalid token' });
    }
    const { username } = decoded;
    const user = await UserModel.findOne({ username })
    if (!user) {
      return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};
