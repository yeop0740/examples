import { Logger, Scope } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor({ name: 'audio', scope: Scope.DEFAULT })
export class AudioProcessor extends WorkerHost {
  private readonly logger = new Logger(AudioProcessor.name);

  async process(job: Job, token: string | undefined): Promise<any> {
    switch (job.name) {
      case 'transcode': {
        let progress = 0;
        this.logger.log('[consumer] token', token);
        this.logger.log('[consumer] job.data', job.data);
        for (let i = 0; i < 100; i++) {
          await this.doSomething();
          progress += 1;
          await job.updateProgress(progress);
        }
        break;
      }
      default:
        this.logger.log('Unknown job', job.name);
        break;
    }
  }

  private async doSomething() {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }
}
