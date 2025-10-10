import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSummaryDto } from './create-summary-dto';
import { SummaryCreated } from './summary-created';

@Injectable()
export class AppService {
  constructor(
    @Inject('SUMMARY_SERVICE') private readonly client: ClientProxy,
  ) {}
  getHello(): string {
    return 'ok';
  }

  createSummary(createSummaryDto: CreateSummaryDto) {
    console.log(`${createSummaryDto.postId} 에 대한 요약 요청(LLM API)`);
    console.log('응답 저장(DB)');
    this.client.emit(
      'summary.created',
      new SummaryCreated({
        userId: createSummaryDto.userId,
        postId: createSummaryDto.postId,
      }),
    );
  }
}
