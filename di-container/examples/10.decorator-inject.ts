import {Container, inject, injectable} from "inversify";

const weaponServiceId = Symbol.for('Weapon');

interface Weapon {
    damage: number;
}

class Katana {
    constructor(public readonly damage: number = 10) {
    }
}

@injectable()
class Ninja {
    constructor(
        @inject(weaponServiceId)
        public readonly weapon: Weapon,
    ) {
    }
}

const container = new Container();

container.bind(Ninja).toSelf();
container.bind(weaponServiceId).to(Katana);

const ninja = container.get(Ninja);

console.log(ninja.weapon.damage); // 10
