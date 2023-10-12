import express from 'express';
import config from '../../util/config';
import logger from '../../util/logger';
import { consumeNotifications } from './notification-consumer';

const startService = async () => {
  const app = express();

  app.get('/health', (request, response) => {
    response.json({ status: 'Notification Service is responding' });
  });
  
  app.listen(config.NOTIFICATION_SERVICE_PORT, () => {
      logger.info(`Notification Service is running on port ${config.NOTIFICATION_SERVICE_PORT}`);
  });

  await consumeNotifications(); 
};

startService()
  .catch((error) => logger.error('Error starting Notification Service', error));
