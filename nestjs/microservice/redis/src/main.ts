import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6381, // 실제 포트 적용, docker-compose 로 한 번에 띄울 때 포트 설정 확인 필요
    },
  });
  app.startAllMicroservices();
  app.listen(3000);
}
bootstrap();
