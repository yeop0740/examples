import { AccountId } from "./account-id";
import { Money } from "./money";

export class Activity {
    constructor(private readonly sourceAccountId: AccountId, private readonly fromAccountId: AccountId, private readonly toAccountId: AccountId, private readonly date: Date, private readonly money: Money) { }

    public getMoney() {
        return this.money;
    }
}
