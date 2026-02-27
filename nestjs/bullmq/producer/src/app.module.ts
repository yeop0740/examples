import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BullModule } from '@nestjs/bullmq';
import { AudioModule } from './audio/audio.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        // host: 'localhost',
        host: 'redis', // docker compose 로 실행 시 compose file 내의 service name 으로 설정
        // port: 6382,
        port: 6379, // docker compose 로 실행 시 동일 network 내의 port 로 통신
      },
    }),
    AudioModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
