import {Container, preDestroy} from "inversify";

interface Weapon {
    damage: number;
}

class Katana implements Weapon {
    readonly #damage: number = 10;

    public get damage(): number {
        return this.#damage;
    }

    @preDestroy()
    public onDeactivation(): void {
        console.log(`Deactivating weapon with damage: ${this.damage.toString()}`);
    }
}

const container = new Container();
container.bind<Weapon>('Weapon').to(Katana).inSingletonScope(); // singleton 이 아니면 unbind 시점에 destroy 가 호출되지 않는듯.
container.get('Weapon');

// print the message
container.unbind('Weapon').then(() => console.log('done'));
