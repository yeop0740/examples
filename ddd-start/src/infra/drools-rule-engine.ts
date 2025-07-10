import { Customer } from '../customer';
import { Money } from '../money';
import { OrderLine } from '../order-line';
import { RuleDiscounter } from '../application/rule-discounter.interface';

export class DroolsRuleEngineLegacy {
	public evaluate(ruleName: string, facts: any[]) {
		// 어쩌고 저쩌고 drools 를 이용한 계산
	}
}

export class DroolsRuleEngine implements RuleDiscounter {
	applyRules(customer: Customer, orderLines: OrderLine[]): Money {
		// 어쩌고 저쩌고 drools 를 이용한 계산
		return new Money(0);
	}
}
