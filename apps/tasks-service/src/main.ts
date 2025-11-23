import { NestFactory } from '@nestjs/core';
import { TasksServiceModule } from './tasks-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TasksServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
      queue: 'tasks_queue',
      queueOptions: { durable: false },
    },
  });

  await app.listen();
  console.log('✅ Tasks Service conectado a RabbitMQ');
}
bootstrap();
