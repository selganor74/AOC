import { buildLinesArray } from "./buildLinesArray";
import { Coords } from "./coords";
import { fallDirections } from "./fallDirections";
import { fallStartX, fallStartY } from "./input";
import { AIR, GRAIN, GRAIN_AT_REST, Screen, VOID_FALL } from "./screen";


const min: Coords = { x: Number.MAX_VALUE, y: Number.MAX_VALUE };
const max: Coords = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };

const allLines: Coords[][] = buildLinesArray(min, max);

// By definition, grains start falling at 500,0 so make min Y = 0. 
min.y = 0;
// We give some more room for grains to expand freely ...
min.x -= 25;
max.x += 25;

const screen = new Screen(min, max, VOID_FALL);

screen.drawRocks(allLines);

screen.print();

let sandIsFallingIntoVoid = false;
let currentGrainIsAtRest = false;
let totalGrainsAtRest = 0;

while (!sandIsFallingIntoVoid) {
    const currentGrainPos: Coords = { x: fallStartX, y: fallStartY };
    let prevGrainPos: Coords = undefined!;
    currentGrainIsAtRest = false;
    while (!currentGrainIsAtRest && !sandIsFallingIntoVoid) {
        let pointAtDest = "";
        let foundPosition = false;
        for (const fd of fallDirections) {
            let dest = { x: currentGrainPos.x + fd.x, y: currentGrainPos.y + fd.y };
            pointAtDest = screen.getPoint(dest);
            if (pointAtDest === VOID_FALL) {
                sandIsFallingIntoVoid = true;
                break;
            }
            if (pointAtDest === AIR) {
                foundPosition = true;
                currentGrainPos.x += fd.x;
                currentGrainPos.y += fd.y;
                screen.drawPoint(currentGrainPos, GRAIN);
                if (prevGrainPos!) {
                    screen.drawPoint(prevGrainPos, AIR);
                }
                prevGrainPos = prevGrainPos! || {} as Coords;
                prevGrainPos.x = currentGrainPos.x;
                prevGrainPos.y = currentGrainPos.y;

                break;
            }
        }
        if (!foundPosition && !sandIsFallingIntoVoid) {
            // grain is at rest
            currentGrainIsAtRest = true;
            screen.drawPoint(currentGrainPos, GRAIN_AT_REST);
            totalGrainsAtRest++;
        }
    }
}

console.log("Grains at rest: " + totalGrainsAtRest);
screen.print();
console.log("Part1 result: " + totalGrainsAtRest);