import express, { Express } from 'express';
import { databaseConnection } from './database';
import { start } from './server';

const app: Express = express();
const initialize = (): void => {
  databaseConnection();
  start(app);
};

initialize();

export { app };
