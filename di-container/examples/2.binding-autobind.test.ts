import { Container, injectable } from 'inversify';

class Katana {
  public readonly damage: number = 10;
}

@injectable()
class Samurai {
  constructor(public readonly katana: Katana) {}
}

test('auto bind 옵션을 사용하지 않았을 때 Katana 과 Samurai 에 대한 의존성을 주입하지 않으면 에러를 발생시킨다.', () => {
  // given
  const container = new Container();
  // no bindings for katana and samurai

  // when, then
  expect(() => container.get(Katana)).toThrow();
  expect(() => container.get(Samurai)).toThrow();
});

test('auto bind 옵션을 사용하지 않고 bind 를 이용하여 의존성을 주입하면 객체를 주입할 수 있다.', () => {
  // given
  const container = new Container();
  container.bind(Katana).toSelf();
  container.bind(Samurai).toSelf();

  // when
  const samurai = container.get(Samurai);
  const katana = container.get(Katana);

  // then
  expect(samurai).not.toBeUndefined();
  expect(samurai).not.toBeNull();
  expect(samurai).toBeInstanceOf(Samurai);

  expect(katana).not.toBeUndefined();
  expect(katana).not.toBeNull();
  expect(katana).toBeInstanceOf(Katana);
});

test('auto bind 옵션을 사용하여 의존성을 주입하면 객체를 주입할 수 있다.', () => {
  // given
  const container = new Container();

  // no bindings for katana and samurai

  // when
  const samurai = container.get(Samurai, { autobind: true });
  const katana = container.get(Katana, { autobind: true });

  // then
  expect(samurai).not.toBeUndefined();
  expect(samurai).not.toBeNull();
  expect(samurai).toBeInstanceOf(Samurai);

  expect(katana).not.toBeUndefined();
  expect(katana).not.toBeNull();
  expect(katana).toBeInstanceOf(Katana);
});
