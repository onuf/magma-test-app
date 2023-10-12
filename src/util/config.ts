export interface RabbitMQConfig {
  URL: string,
  EXCHANGE_NAME: string,
  QUEUE_NAME: string,
  BINDING_KEY: string,
}

export interface Config {
  PORT: string | number,
  NOTIFICATION_SERVICE_PORT: string | number,
  DATABASE_URL: string,
  rabbitMQ: RabbitMQConfig,
}

const config: Config = {
  PORT: process.env.PORT || 3001,
  NOTIFICATION_SERVICE_PORT: process.env.NOTIFICATION_SERVICE_PORT || 3002,
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/users_db',
  rabbitMQ: {
    URL: process.env.RABBIT_MQ_URL || 'amqp://localhost',
    EXCHANGE_NAME: process.env.RABBIT_MQ_EXCHANGE_NAME || 'notificationExchange',
    QUEUE_NAME: process.env.RABBIT_MQ_QUEUE_NAME || 'UserEventsQueue',
    BINDING_KEY: process.env.RABBIT_MQ_BINDING_KEY || 'user-event',
  },
};

export default config;
