import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio',
    }),
  ],
  controllers: [MetricsController],
})
export class MetricsModule {}
