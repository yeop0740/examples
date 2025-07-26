import { Container, injectable } from 'inversify';

class Katana {
  public readonly damage: number = 10;
}

@injectable()
class Samurai {
  constructor(public readonly katana: Katana) {}
}

const container = new Container();
// no bindings for katana
const samurai = container.get(Samurai, { autobind: true });
// const samurai = container.get(Samurai); // error

console.log(samurai);
