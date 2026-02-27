import { Controller, Get, Inject } from '@nestjs/common';
import { MATH_SERVICE } from './math.constant';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class MathController {
  constructor(@Inject(MATH_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  async getHello() {
    console.log('hello');
    const response = this.client.send({ cmd: 'hello' }, { me: 'world!' });
    console.dir(response, { depth: null });
    return response;
  }

  @MessagePattern({ cmd: 'hello' })
  async greeting(@Payload() data: { me: string }, @Ctx() context: RmqContext) {
    console.log(data);
    console.log(`pattern: ${context.getPattern()}`);
    console.log(`origin data: ${context.getMessage()}`); // 원본 RMQ 메시지 접근 방법(properties, fields, content 포함)
    console.log(`channel: ${context.getChannelRef()}`); // 채널에 대한 참조
    console.dir(context, { depth: null });
    return 'world';
  }
}
