import amqp from 'amqplib';
import config from '../../util/config';
import logger from '../../util/logger';
import { UserEventData, USER_EVENTS } from '../../util/types';


async function connectWithRetry(maxRetries: number = 4, retryDelay: number = 5000) {
  let retryCount = 0;
  let connected = false;

  while (retryCount < maxRetries && !connected) {
    try {
      const connection = await amqp.connect(config.rabbitMQ.URL);
      logger.info('Connected to RabbitMQ');

      const channel = await connection.createChannel();
      await channel.assertExchange(config.rabbitMQ.EXCHANGE_NAME, 'direct');

      const q = await channel.assertQueue(config.rabbitMQ.QUEUE_NAME);
      await channel.bindQueue(q.queue, config.rabbitMQ.EXCHANGE_NAME, config.rabbitMQ.BINDING_KEY);

      logger.info('Notification Service is waiting for messages...');
      connected = true;
  
      await channel.consume(q.queue, (msg) => {
        if (!msg)
          return;
    
        const data = JSON.parse(msg.content.toString()) as UserEventData;
        handleUserEvent(data);
        channel.ack(msg);
      });
    } catch (error) {
      logger.error(`Error connecting to RabbitMQ (Attempt ${retryCount + 1}):`, error);
      retryCount++;

      if (retryCount < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  if (!connected) {
    logger.error(`Failed to connect to RabbitMQ after ${maxRetries} attempts. Exiting...`);
  }
}

export async function consumeNotifications() {
  logger.info('Connecting to', config.rabbitMQ.URL);
  await connectWithRetry();
}

function handleUserEvent(event: UserEventData) {
  if (event.type === USER_EVENTS.CREATION) {
    logger.info(`Welcome, ${event.data.name}!`);
  } else {
    logger.info(`Goodbye, ${event.data.name}!`);
  }
}
