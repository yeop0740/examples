export class Receiver {
    #name: string;
    #phoneNumber: string;

    constructor(name: string, phoneNumber: string) {
        this.#name = name;
        this.#phoneNumber = phoneNumber;
    }

    get name() {
        return this.#name;
    }

    get phoneNumber() {
        return this.#phoneNumber;
    }
}
