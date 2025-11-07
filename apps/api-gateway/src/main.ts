import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'api_gateway',                        
      queueOptions: {
        durable: false,                            
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.API_GATEWAY_PORT || 3000);

  console.log(`🚀 API Gateway corriendo en http://localhost:${process.env.API_GATEWAY_PORT || 3000}`);
  console.log(`📡 Conectado a RabbitMQ en amqp://localhost:5672`);
}

bootstrap();
