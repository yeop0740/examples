import {Container, injectable, unmanaged} from "inversify";

@injectable()
class Base {
    public prop: string;
    constructor(@unmanaged() arg: string) {
        this.prop = arg;
    }
}

@injectable()
class Derived extends Base {
    constructor() {
        super('inherited-value');
    }
}

const container = new Container();
container.bind(Derived).toSelf();

const derived = container.get(Derived);
// 'inherited-value'
console.log(derived.prop);
