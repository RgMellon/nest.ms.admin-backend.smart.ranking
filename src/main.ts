import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { formatInTimeZone } from 'date-fns-tz';

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

  Date.prototype.toJSON = function (): any {
    const timeZone = 'America/Sao_Paulo';
    return formatInTimeZone(this, timeZone, 'yyyy-MM-dd HH:mm:ss.SSS');
  };

  await app.listen();
}
bootstrap();
