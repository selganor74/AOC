
export class Point {
    constructor(
        public x: number,
        public y: number
    ) { }

    plus(other: Point): Point {
        return new Point(this.x + other.x, this.y + other.y);
    }

    public toString(): string {
        return `{ x: ${this.x}, y: ${this.y} }`;
    }
}