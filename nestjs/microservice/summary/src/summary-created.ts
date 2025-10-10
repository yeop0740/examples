export class SummaryCreated {
  readonly userId: string;
  readonly postId: string;

  constructor(params: SummaryCreated) {
    this.postId = params.postId;
    this.userId = params.userId;
  }
}
