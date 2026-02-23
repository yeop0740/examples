import {
	DroolsRuleEngine,
	DroolsRuleEngineLegacy,
} from '../infra/drools-rule-engine';
import { OrderLine } from '../order-line';
import { MutableMoney } from '../mutable-money';
import { RuleDiscounter } from './rule-discounter.interface';
import { Customer } from '../customer';
import { CustomerRepository } from './persistent/customer.repository';

export class CalculateDiscountServiceLegacy {
	#ruleEngine: DroolsRuleEngineLegacy;

	constructor(ruleEngine: DroolsRuleEngineLegacy) {
		this.#ruleEngine = ruleEngine;
	}

	/**
	 * DroolsRuleEngine 를 사용하여 할인 금액을 계산한다.
	 */
	public calculateDiscount(orderLines: OrderLine[], customerId: number) {
		const customer = this.#findCustomer(customerId);

		// rule engine 을 사용하기 위한 데이터 생성 -> RuleDiscounter 인터페이스의 구체 클래스를 주입받아 삭제됨
		const money = new MutableMoney(0);
		const facts = [customer, money, orderLines];
		this.#ruleEngine.evaluate('discountCalculation', facts);
		return money.toMutableMoney();
	}

	#findCustomer(customerId: number) {
		return new Customer();
	}
}

export class CalculateDiscountService {
	#ruleEngine: RuleDiscounter;
	#customerRepository: CustomerRepository;

	constructor(
		ruleEngine: RuleDiscounter,
		customerRepository: CustomerRepository,
	) {
		this.#ruleEngine = ruleEngine;
		this.#customerRepository = customerRepository;
	}

	/**
	 * RuleDiscounter 를 사용하여 할인 금액을 계산한다.
	 */
	public calculateDiscount(orderLines: OrderLine[], customerId: number) {
		const customer = this.#findCustomer(customerId);
		return this.#ruleEngine.applyRules(customer, orderLines);
	}

	#findCustomer(customerId: number) {
		const customer = this.#customerRepository.findById(customerId);
		if (!customer) {
			throw new Error('Customer not found');
		}

		return customer;
	}
}
