/**
 * binding 은 서비스 식별자와 구체 클래스를 나타내는 역할을 한다.
 * bindings 는 service 들을 제공하는 컨테이너에 설정을 위해 추가된다.
 */
import {Container, inject, injectable} from "inversify";

interface Weapon {
    damage: number;
}

class Katana {
    constructor(public readonly damage: number = 10) {}
}

@injectable()
export class Samurai {
    constructor(public readonly katana: Katana) {}
}

const container: Container = new Container();
container.bind<Weapon>('Weapon').to(Katana).inSingletonScope();
container.bind(Katana).toSelf().inSingletonScope();
container.bind(Samurai).toSelf().inSingletonScope();

const samurai = container.get(Samurai);
const weapon = container.get('Weapon');
console.log(samurai);
