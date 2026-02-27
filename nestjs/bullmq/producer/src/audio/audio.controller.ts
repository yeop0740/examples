import { Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Controller('audio')
export class AudioController {
  constructor(@InjectQueue('audio') private readonly audioQueue: Queue) {}

  @Post('transcode')
  async transcode() {
    const job = await this.audioQueue.add('transcode', {
      file: 'audio.mp3',
    });

    console.log(job); //  { jobId: '1', prev: 'waiting' }
  }
}
