import { Customer } from '../../customer';

export interface CustomerRepository {
	findById(id: number): Customer;
}
