import {Container, inject, injectable, tagged} from "inversify";

interface Weapon {
    damage: number;
}

class Katana implements Weapon {
    constructor(public readonly damage: number = 10) {}
}

class Shuriken implements Weapon {
    constructor(public readonly damage: number = 5) {}
}

@injectable()
class Ninja {
    constructor(
        @inject('Weapon') @tagged('weaponKind', 'melee') public readonly katana: Weapon,
        @inject('Weapon') @tagged('weaponKind', 'ranged') public readonly shuriken: Weapon,
    ) {}
}

const container = new Container();
container.bind<Weapon>('Weapon')
    .to(Katana)
    .whenTagged('weaponKind', 'melee');
container.bind<Weapon>('Weapon')
    .to(Shuriken)
    .whenTagged('weaponKind', 'ranged');
container.bind(Ninja).toSelf();

const ninja = container.get(Ninja);
/*
Ninja {
  katana: Katana { damage: 10 },
  shuriken: Shuriken { damage: 5 }
}
 */
console.log(ninja);
