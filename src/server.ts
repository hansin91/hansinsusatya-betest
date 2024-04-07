import { json, urlencoded, Application } from 'express';
import http from 'http';
import { Config } from './config';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import userRouter from '@user/user.route';
import accountRouter from '@account/account.route';
import { redisClient } from './redis';

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    console.info(`Users server has started with process id ${process.pid}`);
    httpServer.listen(Config.PORT, () => {
      console.info(`Users server running on port ${Config.PORT}`);
    });
  } catch (error) {
    console.log('error', 'UsersService startServer() method error:', error);
  }
};

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
  startServer(app);
};
