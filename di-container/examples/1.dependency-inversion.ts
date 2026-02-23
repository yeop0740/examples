import {inject, injectable} from "inversify";

export interface Weapon {
    damage: number;
}

export const weaponServiceId: symbol = Symbol.for("WeaponServiceId")

@injectable()
export class Katana {
    public readonly damage: number = 10;
}

@injectable()
export class Ninja {
    constructor(@inject(weaponServiceId) public readonly weapon: Weapon) {}
}

/**
 * symbol 을 사용하여 구체 클래스가 구현 세부 사항에 대해 인지하지 않고, 인테페이스 구현을 제공할 수 있다.
 * 인터페이스를 통한 의존성 주입을 사용하기 위해 symbol 을 사용하는 것을 추천하지만, 클래스들과 문자열 리터럴들 또한 서비스 식별자로 사용할 수 있다.
 */