interface Weapon {
  damage: number;
}

export class Katana implements Weapon {
  constructor(public readonly damage: number = 10) {}
}

export class Shuriken implements Weapon {
  constructor(public readonly damage: number = 5) {}
}

export class Ninja {
  constructor(
    public readonly katana: Katana,
    public readonly shuriken: Shuriken,
  ) {}
}
