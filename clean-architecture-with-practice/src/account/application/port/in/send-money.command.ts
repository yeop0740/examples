import { AccountId } from "src/account/domain/account-id";
import { Money } from "src/account/domain/money";

export class SendMoneyCommand {
    constructor(private readonly sourceAccountId: AccountId, private readonly tartgetAccountId: AccountId, private readonly money: Money) {
        this.sourceAccountId = sourceAccountId
        this.tartgetAccountId = tartgetAccountId
        this.money = money
        if (!money.isPositive()) {
            throw new Error('IllegalArguments error');
        }
    }

    public getAccountSourceId() {
        return this.sourceAccountId;
    }

    public getTargetAccountId() {
        return this.tartgetAccountId;
    }

    public getMoney() {
        return this.money;
    }
}
