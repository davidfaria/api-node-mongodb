import './bootstrap';
import path from 'path';
import express from 'express';
import helmet from 'helmet';

import sendError from '@middlewares/sendError';
import cors from '@middlewares/cors';
import rateLimit from '@middlewares/rateLimit';

import './database';

import routes from './routes';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(helmet());
    this.server.use(express.json());
    this.server.use(cors);
    this.server.use(sendError);
    this.server.use(rateLimit);
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      return res.status(500).json(err);
    });
  }
}

export default new App().server;
