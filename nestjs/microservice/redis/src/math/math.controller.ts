import { Controller, Get, Inject } from '@nestjs/common';
import { MATH_SERVICE } from './math.constant';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';

@Controller()
export class MathController {
  constructor(@Inject(MATH_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  async getHello() {
    console.log('여기보세요~!');
    return this.client.send({ cmd: 'hello' }, 'world');
  }

  @MessagePattern({ cmd: 'hello' })
  handleMessage(@Payload() data: string, @Ctx() context: RedisContext): string {
    console.log(context); // RedisContext { args: [ '{"cmd":"hello"}' ] }
    console.log(context.getChannel());
    console.log(data);
    return 'hello';
  }
}
