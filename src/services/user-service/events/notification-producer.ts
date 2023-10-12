import amqp from 'amqplib';
import {RabbitMQConfig} from '../../../util/config';
import { UserEventData } from '../../../util/types';
import logger from '../../../util/logger';


export class UserEventProducer {
  url: string;
  exchangeName: string;
  queueName: string;
  bindingKey: string;
  channel?: amqp.Channel;

  constructor(config: RabbitMQConfig) {
    this.url = config.URL;
    this.exchangeName = config.EXCHANGE_NAME;
    this.queueName = config.QUEUE_NAME;
    this.bindingKey = config.BINDING_KEY;
  }

  async createChannel() {
    const connection = await amqp.connect(this.url);
    this.channel = await connection.createChannel();
  }

  async publishEvent(data: UserEventData) {
    if (!this.channel) {
      await this.createChannel();
    }

    await this.channel!.assertExchange(this.exchangeName, 'direct');
    const json = JSON.stringify(data);
    this.channel!.publish(this.exchangeName, this.bindingKey, Buffer.from(json));
    logger.info(`Sent ${json} to exchange ${this.exchangeName}`);
  }
}
