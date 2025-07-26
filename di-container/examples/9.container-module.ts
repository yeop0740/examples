import { Container, ContainerModule, ContainerModuleLoadOptions, inject, named } from 'inversify';

interface Weapon {
  damage: number;
}

class Katana implements Weapon {
  constructor(public readonly damage: number = 10) {}
}

class Shuriken implements Weapon {
  constructor(public readonly damage: number = 5) {}
}

class Ninja {
  constructor(
    @inject('Weapon')
    @named('Melee')
    public readonly katana: Weapon,
    @inject('Weapon')
    @named('Ranged')
    public readonly shuriken: Weapon,
  ) {}
}

const warriorModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
  options.bind<Ninja>('Ninja').to(Ninja);
});

const weaponModule: ContainerModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
  options.bind('Weapon').to(Katana).whenNamed('Melee');
  options.bind('Weapon').to(Shuriken).whenNamed('Ranged');
});

const container = new Container();

container.load(warriorModule, weaponModule).then(() => {
  const ninja: Ninja = container.get('Ninja');
  console.log(ninja);
});
