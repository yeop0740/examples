import { AccountId } from "./account-id";
import { Activity } from "./activity";
import { Money } from "./money";

export class ActivityWindow {
    private readonly activities: Activity[] = []

    public calculateBalance(accountId: AccountId) {
        let sum = new Money(0);
        for (let i = 0; i < this.activities.length; i++) {
            sum = Money.add(sum, this.activities[i].getMoney())
        }

        return sum;
    }

    public addActivity(activity: Activity) {
        this.activities.push(activity);
    }
}
