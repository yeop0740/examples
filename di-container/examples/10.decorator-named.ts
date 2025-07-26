import {Container, inject, injectable, named} from "inversify";

interface Weapon {
    damage: number;
}

class Katana implements Weapon {
    constructor(public readonly damage: number = 10) {
    }
}

class Shuriken implements Weapon {
    constructor(public readonly damage: number = 5) {
    }
}

@injectable()
class Ninja {
    constructor(
        @inject('Weapon') @named('melee') public readonly katana: Weapon,
        @inject('Weapon') @named('ranged') public readonly shuriken: Weapon,
    ) {
    }
}

const container: Container = new Container();
container.bind<Weapon>('Weapon').to(Katana).whenNamed('melee');
container.bind<Weapon>('Weapon').to(Shuriken).whenNamed('ranged');
container.bind(Ninja).toSelf();

const ninja = container.get(Ninja);
console.log(ninja); // ninja.katana.damage === 10 && ninja.shuriken.damage === 5
