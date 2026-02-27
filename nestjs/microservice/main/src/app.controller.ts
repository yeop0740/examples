import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateSummaryDto } from './create-summary-dto';
import { CreateSummaryRequest } from './create-summary-request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/summary')
  createSummary(@Body() createSummaryRequest: CreateSummaryRequest) {
    console.log('[AppController] createSummary', createSummaryRequest);
    return this.appService.createSummary(
      new CreateSummaryDto({
        userId: createSummaryRequest.userId,
        postId: createSummaryRequest.postId,
      }),
    );
  }
}
