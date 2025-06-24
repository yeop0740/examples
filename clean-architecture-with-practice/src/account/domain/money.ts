export class Money {
    constructor(private readonly amount: number) { }

    public static add(a: Money, b: Money) {
        return new Money(a.amount + b.amount);
    }

    public isPositive(): boolean {
        if (this.amount < 0) {
            return false;
        }

        return true
    }

    public negate(): Money {
        return new Money(this.amount * -1);
    }
}
