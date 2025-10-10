export class CreateSummaryDto {
  readonly userId: string;
  readonly postId: string;

  constructor(params: CreateSummaryDto) {
    this.userId = params.userId;
    this.postId = params.postId;
  }
}
