import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Get, Header } from '@nestjs/common';
import { Queue } from 'bullmq';

@Controller('metrics')
export class MetricsController {
  constructor(@InjectQueue('audio') private readonly audioQueue: Queue) {}

  @Get()
  @Header('Content-Type', 'text/plain; version=1.0.0')
  metrics() {
    return this.audioQueue.exportPrometheusMetrics();
  }
}
