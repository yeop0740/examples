import {Container, inject, injectable, optional} from "inversify";

interface Weapon {
    damage: number;
}

class Katana implements Weapon {
    constructor(public readonly damage: number = 10) {}
}

@injectable()
class Ninja {
    constructor(
        @inject('Katana') public readonly katana: Weapon,
        @inject('Shuriken') @optional() public readonly shuriken: Weapon | undefined,
    ) {}
}

const container = new Container();
container.bind<Weapon>('Katana').to(Katana);

container.bind(Ninja).toSelf();

// ninja has katana and undefined shuriken
const ninja = container.get(Ninja);
// Ninja { katana: Katana { damage: 10 }, shuriken: undefined }
console.log(ninja);
