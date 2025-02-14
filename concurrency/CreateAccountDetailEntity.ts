import { Account } from "@prisma/client";
import { AccountDetail } from "./AccountDetail";

export class CreateAccountDetailEntity {
  prevBalance: number;
  changeAmount: number;
  newBalance: number;
  accountId: number;
  prevAccountDetailId: number | null;

  constructor(
    prevBalance: number,
    changeAmount: number,
    newBalance: number,
    accountId: number,
    prevAccountDetailId?: number | null
  ) {
    this.prevBalance = prevBalance;
    this.changeAmount = changeAmount;
    this.newBalance = newBalance;
    this.accountId = accountId;
    this.prevAccountDetailId = prevAccountDetailId ?? null;
  }

  static of(prevAccountDetail: AccountDetail, newAccountDetail: AccountDetail) {
    if (prevAccountDetail.id === null || prevAccountDetail.id === undefined) {
      throw new Error("invalid prev account detail");
    }

    return new CreateAccountDetailEntity(
      prevAccountDetail.balance,
      newAccountDetail.balance - prevAccountDetail.balance,
      newAccountDetail.balance,
      newAccountDetail.accountId,
      prevAccountDetail.id
    );
  }

  static defaultValue(account: Account) {
    return new CreateAccountDetailEntity(0, 0, 0, account.id);
  }
}
