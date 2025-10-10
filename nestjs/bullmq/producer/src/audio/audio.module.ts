import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio',
    }),
  ],
  controllers: [AudioController],
  providers: [],
})
export class AudioModule {}
