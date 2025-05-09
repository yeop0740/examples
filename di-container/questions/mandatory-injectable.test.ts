import { Container } from 'inversify';
import { Katana, Shuriken, Ninja } from './no-injectable';

test('데코레이터를 사용하지 않는 경우', () => {
  const container = new Container();
  container.bind(Katana).toSelf();
  container.bind(Shuriken).toSelf();

  expect(() => {
    container.bind(Ninja).toSelf();
  }).toThrow();
});
