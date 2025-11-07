import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcToHttpExceptionFilter } from '@app/common/exceptions/rpc-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
      queue: 'api_gateway',
      queueOptions: {
        durable: false,                            
      },
    },
  });

  app.useGlobalFilters(new RpcToHttpExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(process.env.API_GATEWAY_PORT || 3000);

  console.log(`🚀 API Gateway corriendo en http://localhost:${process.env.API_GATEWAY_PORT || 3000}`);
  console.log(`📡 Conectado a RabbitMQ en amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`);
}

bootstrap();
