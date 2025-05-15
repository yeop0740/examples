import {Password} from "./password";
import {Address} from "./address";

export class Member {
    #id: number;
    #name: string;
    #email: string;
    #password: Password;
    #address: Address;

    constructor(id: number, name: string, email: string, password: Password, address: Address) {
        this.#id = id;
        this.#name = name;
        this.#email = email;
        this.#password = password;
        this.#address = address;
    }

    get id() {
        return this.#id;
    }

    changePassword(currentPassword: string, newPassword: string) {
        if (!this.#password.match(currentPassword)) {
            throw new Error('Current password is not correct');
        }

        this.#password = new Password(newPassword);
    }

    changeAddress(newAddress: Address) {
        this.#address = newAddress;
    }
}
