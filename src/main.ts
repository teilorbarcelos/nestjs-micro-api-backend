import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RMQ_SERVER_URL } from 'env';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: { urls: [RMQ_SERVER_URL], queue: 'admin-backend' },
  });

  await app.listen();
}
bootstrap();
