import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  //TODO criar anotacao substituir para createMicroService
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://renan:naner994@18.217.224.224:5672/smartranking'],
      noAck: false, // acknolage, so pode deletar a msg da fila depois que devolver uma msg pra ele
      queue: 'admin-backend',
    },
  });

  await app.listen();
}
bootstrap();
