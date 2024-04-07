import express, { Express } from 'express';
import { databaseConnection } from './database';
import { start } from './server';

const initialize = (): void => {
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();
