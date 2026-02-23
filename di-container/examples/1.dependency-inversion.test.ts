import {Katana, Ninja, Weapon, weaponServiceId} from "./1.dependency-inversion";
import {Container} from "inversify";

describe('Dependency Inversion', () => {
    it('symbol 을 사용하여 interface 에 대한 의존성을 주입할 수 있다.', () => {
       // given
       const container = new Container();
       container.bind(Ninja).toSelf();
       container.bind(weaponServiceId).to(Katana);

        const ninja = container.get(Ninja);
        const katana = container.get(weaponServiceId);

        // then
        expect(ninja).toBeInstanceOf(Ninja);
        expect(katana).toBeInstanceOf(Katana);
    })
})
