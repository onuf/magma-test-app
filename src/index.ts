import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';

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
    app.use(middleware.requestLogger);

    app.get('/api/info', (request, response) => {
      response.send(`App is running with this config: ${JSON.stringify(config)}`);
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
