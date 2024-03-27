import { Coords } from "./coords";
import { rocks } from "./input";

export function buildLinesArray(min: Coords, max: Coords) {
    let allInputRows = rocks.split("\n");
    let allLines: Coords[][] = [];

    for (const row of allInputRows) {
        const allCoordsPair = row.split(" -> ");
        const toAdd: Coords[] = [];
        for (const cp of allCoordsPair) {
            const splittedCp = cp.split(",");
            const p = { x: Number.parseInt(splittedCp[0]), y: Number.parseInt(splittedCp[1]) };
            toAdd.push(p);
            min.x = p.x < min.x ? p.x : min.x;
            min.y = p.y < min.y ? p.y : min.y;
            max.x = p.x > max.x ? p.x : max.x;
            max.y = p.y > max.y ? p.y : max.y;
        }
        allLines.push(toAdd);
    }

    return allLines;
}
