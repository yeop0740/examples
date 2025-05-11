import {Customer} from "../customer";

export class CustomerRepository {

    findById(id: number) {
        return new Customer();
    }
}
