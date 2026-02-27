import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AudioProcessor } from './audio.processor';
import { AudioEventsListener } from './audio-events.listener';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio',
    }),
  ],
  providers: [AudioProcessor, AudioEventsListener],
})
export class AudioModule {}
