import { Money } from '../money';
import { OrderLine } from '../order-line';
import { Customer } from '../customer';

export interface RuleDiscounter {
	applyRules(customer: Customer, orderLines: OrderLine[]): Money;
}
