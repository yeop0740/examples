import { AccountId } from "./account-id"
import { Activity } from "./activity"
import { ActivityWindow } from "./activity-window"
import { Money } from "./money"

export class Account {
    constructor(private readonly id: AccountId, private readonly baselineBalance: Money, private readonly activityWindow: ActivityWindow) { }

    public calculateBalance(): Money {
        return Money.add(this.baselineBalance, this.activityWindow.calculateBalance(this.id))
    }

    public withdraw(money: Money, targetAccountId: AccountId): boolean {
        if (!this.mayWithdraw(money)) {
            return false;
        }

        const withdrawal = new Activity(
            this.id,
            this.id,
            targetAccountId,
            new Date(),
            money,
        )

        this.activityWindow.addActivity(withdrawal)

        return true;
    }

    // 비즈니스 규칙 검증
    private mayWithdraw(money: Money): boolean {
        return Money.add(
            this.calculateBalance(),
            money.negate())
            .isPositive()
    }

    public deposit(money: Money, sourceAccountId: AccountId): boolean {
        const deposit = new Activity(
            this.id,
            sourceAccountId,
            this.id,
            new Date(),
            money);
        this.activityWindow.addActivity(deposit);

        return true;
    }
}
