import {BindingConstraints, Container, inject, injectable, named} from "inversify";

const ninjaId: symbol = Symbol.for('Ninja');
const weaponId: symbol = Symbol.for('Weapon');

interface Weapon {
    damage: number;
}

class Katana {
    constructor(public readonly damage: number = 10) {
    }
}

class Shuriken {
    constructor(public readonly damage: number = 5) {
    }
}

@injectable()
class Ninja {
    constructor(
        @inject(weaponId)
        // @named('shuriken')
        @named('katana')
        public readonly weapon: Weapon,
    ) {
    }
}


const container = new Container();

container.bind(ninjaId).to(Ninja);

const whenTargetNamedConstraint: (name: string) => (bindingconstraints: BindingConstraints) => boolean =
    (name: string) => (bindingconstraints: BindingConstraints): boolean =>
        bindingconstraints.name === name;

container
    .bind(weaponId)
    .to(Katana)
    .when(whenTargetNamedConstraint('katana'));

container
    .bind(weaponId)
    .to(Shuriken)
    .when(whenTargetNamedConstraint('shuriken'));

const ninja = container.get(ninjaId);
console.log(ninja); // if @named('shuriken') then ninja.damage === 5
