import {Receiver} from "./receiver";
import {Address} from "./address";

export class ShippingInfo {
    // #receiverName: string;
    // #receiverPhoneNumber: string; => receiver
    // #shippingAddress1: string;
    // #shippingAddress2: string;
    // #shippingZipCode: string; => address
    #receiver: Receiver;
    #address: Address;

    constructor(receiver: Receiver, address: Address) {
        this.#receiver = receiver;
        this.#address = address;
    }

    get address() {
        return this.#address;
    }
}
