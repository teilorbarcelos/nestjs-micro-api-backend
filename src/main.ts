import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import * as momentTimezone from 'moment-timezone';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('Main');
const configService = new ConfigService();
const RABBITMQ_USER = configService.get<string>('RABBITMQ_USER');
const RABBITMQ_PASSWORD = configService.get<string>('RABBITMQ_PASSWORD');
const RMQ_SERVER_URL = configService.get<string>('RMQ_SERVER_URL');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RMQ_SERVER_URL}`],
      noAck: false,
      queue: 'admin-backend',
    },
  });

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen();
}
bootstrap();
