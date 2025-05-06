import {Container, inject, injectable} from "inversify";

@injectable()
export class Katana {
    public readonly damage: number = 10;
}

@injectable()
export class Ninja {
    constructor(@inject(Katana) public readonly katana: Katana) {
    }
}

// const container = new Container()
//
// container.bind(Ninja).toSelf();
// container.bind(Katana).toSelf();
//
// const ninja: Ninja = container.get(Ninja);
//
// // Output: 10
// console.log(ninja.katana.damage);
// console.log(ninja);
// console.log(ninja.katana);
// console.log(container.get(Katana));
// console.log(new Katana());
// const katanaFromConstructor = new Katana();
// const katanaFromContainer1 = container.get(Katana);
// const katanaFromContainer2 = container.get(Katana);



/**
 * `@injectable` 데코레이터는 `Katana` 와 `Ninja` 클래스가 컨테이너 바인딩(구성품정도 되는 개념?)으로 사용될 수 있도록 한다.
 * `@inject` 데코레이터는 `Ninja` 클래스에 대한 메타데이터를 제공하여, `Ninja` 클래스의 생성자에서 첫 번째 인자로 `Katana` 객체가 주입되어야 한다는 것을 container 가 알 수 있도록 한다.
 *
 * bindings 는 `Container` API 를 통해 제공된다.
 *
 * 이 두 단계를 통해, ninja 를 생성할 수 있다.
 */

/**
 * 내가 이해한 대로라면, `@injectable` 데코레이터로 컨테이너에 담을 수 있는 클래스를 정의할 수 있다.
 * `@inject` 데코레이터는 의존성을 주입할 수 있도록 한다. 이때 의존성은 컨테이너에 담긴 녀석이다.
 * container 객체에 serviceId 를 입력하는 과정이 필요하다(컨테이너가 관리할 클래스를 명명하는 단계).
 * 모두 다 등록하였다면, container.get() 메서드를 통해 인스턴스 가져다 사용할 수 있다.
 */