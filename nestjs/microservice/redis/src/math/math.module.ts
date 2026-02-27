import { Module } from '@nestjs/common';
import { MathController } from './math.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6381, // 실제 포트 적용
        },
      },
    ]),
  ],
  controllers: [MathController],
})
export class MathModule {}
