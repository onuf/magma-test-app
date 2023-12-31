import express, { Request } from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import morgan from 'morgan';

import userRouter from './services/user-service/routes/users';
import config from './util/config';
import logger from './util/logger';
import * as middleware from './util/middleware';

const app = express();

mongoose.set('strictQuery', false);

const startApp = async () => {
  try {
    logger.info('Connecting to', config.DATABASE_URL);
    await mongoose.connect(config.DATABASE_URL);
    logger.info('Connected to MongoDB');

    app.use(express.json());

    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
    morgan.token('body', function (request: Request) {
      return JSON.stringify(request.body);
    });

    app.get('/api/info', (request, response) => {
      response.send(`App is running with this config: ${JSON.stringify(config)}`);
    });

    app.get('/health', (request, response) => {
      response.json({ status: 'User Service is responding' });
    });

    app.use('/api/users', userRouter);

    app.use(middleware.unknownEndpoint);
    app.use(middleware.errorHandler);

    app.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error('Error connecting to MongoDB', error);
  }
};

void startApp();
