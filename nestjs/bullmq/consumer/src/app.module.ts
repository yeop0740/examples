import { Module } from '@nestjs/common';
import { AudioModule } from './audio/audio.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    AudioModule,
    BullModule.forRoot({
      connection: {
        // host: 'localhost',
        host: 'redis',
        // port: 6382,
        port: 6379,
      },
    }),
  ],
})
export class AppModule {}
