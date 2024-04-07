import express, { Express, Request, Response } from 'express';
import { databaseConnection } from './database';
import { start } from './server';

const initialize = (): void => {
  databaseConnection();
  const app: Express = express();
  app.get('/', (_: Request, res: Response) => {
    res.send('Express');
  });
  start(app);
};

initialize();
