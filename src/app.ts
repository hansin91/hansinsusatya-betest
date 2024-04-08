import express, { Express } from 'express';
import { databaseConnection } from './database';
import { start } from './server';
import http from 'http';
import { Config } from './config';

const app: Express = express();
const initialize = (): http.Server => {
  databaseConnection();
  start(app);
  const httpServer: http.Server = new http.Server(app);
    console.info(`Users server has started with process id ${process.pid}`);
    httpServer.listen(Config.PORT, () => {
      console.info(`Users server running on port ${Config.PORT}`);
  });
  return httpServer;
};
const server = initialize();
export { server };
