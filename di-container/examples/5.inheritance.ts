class BaseShape {
    kind: string;

    constructor(kind: string) {
        this.kind = kind;
    }
}

class SquareShape extends BaseShape {
    constructor() {
        super('square');
    }
}

class BaseShape2 {
    constructor(
        public readonly kind: string,
        public readonly sides: number,
    ) {}
}

class RegularPolygonShape extends BaseShape2 {
    constructor(sides: number) {
        super('regular polygon', sides);
    }
}
