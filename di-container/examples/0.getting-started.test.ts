import {Container} from "inversify";
import {Katana, Ninja} from "./0.getting-started";

describe('container 에 의존성을 저장한 뒤 ', () => {
    const container = new Container();
    container.bind(Katana).toSelf();
    container.bind(Ninja).toSelf();

    it('꺼내 사용할 수 있다.', () => {
        // given when
        const ninja: Ninja = container.get(Ninja);
        const katana = container.get(Katana);

        // then
        expect(ninja).toBeInstanceOf(Ninja);
        expect(ninja.katana).toBeInstanceOf(Katana);
        expect(katana).toBeInstanceOf(Katana);
        expect(ninja.katana).toEqual(katana); // deep equal -> 동일 메모리를 참조하지는 않지만, 모든 속성 값 등을 비교했을 때 동일한 객체
    });

    it ('container 에서 꺼낸 인스턴스는 singleton 이 아니다.', () => {
        // given, when
        const ninja1 = container.get(Ninja);
        const ninja2 = container.get(Ninja);

        const kantana1 = container.get(Katana);
        const kantana2 = container.get(Katana);
        const kantana3 = ninja1.katana;
        const kantana4 = ninja2.katana;

        // then
        expect(ninja1).not.toBe(ninja2);
        expect(kantana2).not.toBe(kantana1);
        expect(kantana2).not.toBe(kantana3);
        expect(kantana3).not.toBe(kantana4);
        expect(kantana1).not.toBe(kantana4);
    })
})
