import { Point } from "./point";


export class Shape {
    public rows: string[];
    public height: number;
    public width: number;

    constructor(
        inputString: string
    ) {
        this.rows = inputString.split("\n").reverse();
        this.height = this.rows.length;
        this.width = this.rows[0].length;
    }

    getTopCoordinate(bottomLeftCoordinate: Point) {
        return bottomLeftCoordinate.y + this.height - 1;
    }

    getShapeContentAt(point: Point): "#" | "." {
        const row = this.rows[point.y] || ".".repeat(this.rows[0].length);
        
        if (point.x < 0 || point.x > row.length - 1)
            return ".";

        return <any>(row.charAt(point.x));
    }

    public toString(): string {
        return this.rows.reverse().join("\n");
    }
}
