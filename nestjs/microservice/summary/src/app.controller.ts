import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { SummaryCreated } from './summary-created';

@Controller()
export class AppController {
  constructor() {}

  @EventPattern('summary.created')
  summaryCreated(
    @Payload() data: SummaryCreated,
    @Ctx() context: RedisContext,
  ) {
    console.log(data);
    console.dir(context, { depth: null });
    console.log('data chunking');
    console.log('data embedding');
    console.log('data indexing');
  }
}
