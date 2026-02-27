import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BullModule } from '@nestjs/bullmq';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
    }),
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
