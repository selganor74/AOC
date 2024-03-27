import { areEqual, Coords } from "./coords";


// ... Strange, using these unicode chars makes the whole thing much, much slower!
// export const ROCK = "█";
// export const GRAIN = "⏺";
// export const GRAIN_AT_REST = "·";
// export const VOID_FALL = "⦱";

export const AIR = " ";

export const ROCK = "#";
export const GRAIN = "+";
export const GRAIN_AT_REST = "o";
export const VOID_FALL = "*";

export class Screen {
    sizeX: number;
    sizeY: number;
    oneRow: string;
    screen: string;

    constructor(
        private min: Coords,
        private max: Coords,
        bottomChar: string
    ) {
        this.sizeX = max.x - min.x;
        this.sizeY = max.y - min.y;

        this.oneRow = AIR.repeat(this.sizeX + 1) + "\n";
        const floor = bottomChar.repeat(this.sizeX + 1) + "\n";
        this.screen = this.oneRow.repeat(this.sizeY + 1) + floor;
    }

    coordsToLinear(p: Coords): number {
        // The + 1 at the end is the "\n" at the end of each row
        const yContribution = (p.y - this.min.y) * (this.oneRow.length);
        const xContribution = (p.x - this.min.x);

        return xContribution + yContribution;
    }

    drawPoint(p: Coords, char: string) {
        const linearCoords = this.coordsToLinear(p);
        this.screen = this.screen.slice(0, linearCoords) + char + this.screen.slice(linearCoords + 1);
    }
    
    drawLine(from: Coords, to: Coords) {
        const deltaX = Math.sign(to.x - from.x);
        const deltaY = Math.sign(to.y - from.y);
        const current: Coords = { x: from.x, y: from.y };
        this.drawPoint(current, ROCK);
        while (!areEqual(current, to)) {
            current.x += deltaX;
            current.y += deltaY;
            this.drawPoint(current, ROCK);
        }
    }
    
    getPoint(p: Coords): string {
        const linearCoords = this.coordsToLinear(p);
        return this.screen.charAt(linearCoords);
    }

    drawRocks(allLines: Coords[][]) {
        for (const line of allLines) {
            let from: Coords;
            for (const to of line) {
                if (to && from!)
                    this.drawLine(from, to);
                from = to;
            }
        }
    }
    

    print() {
        console.log(this.screen);
    }
}