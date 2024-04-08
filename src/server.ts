import { json, urlencoded, Application } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import userRouter from '@user/user.route';
import accountRouter from '@account/account.route';
import { redisClient } from './redis';

const securityMiddleware = (app: Application): void => {
  app.use(helmet());
  app.use(hpp());
  app.use(cors());
};

const middleware = (app: Application): void => {
  app.use(json());
  app.use(urlencoded({ extended: true }));
};

const routes = (app: Application): void => {
  app.use('/api/users', userRouter);
  app.use('/api/accounts', accountRouter);
};

export const start = (app: Application): void => {
  securityMiddleware(app);
  middleware(app);
  routes(app);
  redisClient.connect();
};
