export class Address {
    #address1: string;
    #address2: string;
    #zipCode: string;

    constructor(address1: string, address2: string, zipCode: string) {
        this.#address1 = address1;
        this.#address2 = address2;
        this.#zipCode = zipCode;
    }

    get address1(): string {
        return this.#address1;
    }

    get address2(): string {
        return this.#address2;
    }

    get zipCode(): string {
        return this.#zipCode;
    }
}
