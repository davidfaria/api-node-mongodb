import { Router } from 'express';
import multer from 'multer';
const routes = new Router();

/**
 *  Configs
 */
import multerConfig from '@config/multer';

/**
 * Controllers
 */
import SessionController from '@controllers/SessionController';
import RegisterController from '@controllers/RegisterController';
import ConfirmEmailController from '@controllers/ConfirmEmailController';
import ForgetController from '@controllers/ForgetController';
import UserController from '@controllers/UserController';
import FileController from '@controllers/FileController';
import PlanController from '@controllers/PlanController';
import WalletController from '@controllers/WalletController';

/**
 * Middleware
 */

import authMiddleware from '@middlewares/auth';

/**
 * Validações
 */

import SessionValidator from '@validators/Session';
import RegisterValidator from '@validators/Register';
import ForgetValidator from '@validators/Forget';
import ForgetResetPasswordValidator from '@validators/ForgetResetPassword';
import UserStoreValidator from '@validators/UserStore';
import UserUpdateValidator from '@validators/UserUpdate';
import WalletValidator from '@validators/Wallet';

/**
 * Variáveis
 *
 * */
const upload = multer(multerConfig);

routes.post('/sessions', SessionValidator, SessionController.store);
routes.post('/register', RegisterValidator, RegisterController.store);
routes.post('/confirmEmail', ConfirmEmailController.store);
routes.post('/forget', ForgetValidator, ForgetController.store);
routes.put(
  '/forgetResetPassword',
  ForgetResetPasswordValidator,
  ForgetController.update
);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);

routes.use(authMiddleware);

routes.get('/', async (_, res) => {
  res.json({
    name: 'Api larawork',
    version: '1.0.0',
    mode: process.env.NODE_ENV,
  });
});

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/users', UserController.index);
routes.post('/users', UserStoreValidator, UserController.store);
routes.put('/users', UserUpdateValidator, UserController.update);
routes.delete('/users/:_id', UserController.destroy);

routes.get('/wallets', WalletController.index);
routes.get('/wallets/:_id', WalletController.show);
routes.post('/wallets', WalletValidator, WalletController.store);
routes.put('/wallets/:_id', WalletValidator, WalletController.update);
routes.delete('/wallets/:_id', WalletController.destroy);

export default routes;
