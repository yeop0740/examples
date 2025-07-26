import {Container, postConstruct} from "inversify";

interface Weapon {
    damage: number;
}

class Katana implements Weapon {
    #damage: number = 10;

    public get damage(): number {
        return this.#damage;
    }

    @postConstruct()
    public improve(): void {
        this.#damage += 2;
    }
}

const container = new Container();
container.bind<Weapon>('Weapon').to(Katana);

const katana: Weapon = container.get('Weapon');
// return 12
console.log(katana.damage);
