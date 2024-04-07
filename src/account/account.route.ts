import express from 'express';
import { accountController } from './account.controller';
import { authMiddleware } from 'src/common/auth.middleware';

const accountRouter = express.Router();
accountRouter.use(authMiddleware);
accountRouter.get('/:accountId', accountController.get);
accountRouter.get('/', accountController.search);
accountRouter.post('/', accountController.create);
accountRouter.put('/:accountId', accountController.update);
accountRouter.delete('/:accountId', accountController.delete);

export default accountRouter;
