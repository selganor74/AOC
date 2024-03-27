import { buildLinesArray } from "./buildLinesArray";
import { areEqual, Coords } from "./coords";
import { fallDirections } from "./fallDirections";
import { fallStartX, fallStartY } from "./input";
import { AIR, GRAIN, GRAIN_AT_REST, ROCK, Screen } from "./screen";


export const min: Coords = { x: Number.MAX_VALUE, y: Number.MAX_VALUE };
export const max: Coords = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };

const allLines: Coords[][] = buildLinesArray(min, max);

// By definition, grains start falling at 500,0 so make min Y = 0. 
min.y = 0;
// floor is at max.y + 2... we will add it, so let's increase max.y only by 1
max.y += 1;

// Infinite is a bit too much, so we try some values here:
min.x -= 200;
max.x += 200;

export const screen = new Screen(min, max, ROCK);

screen.drawRocks(allLines);

screen.print();

let sandHasReachedTheTop = false;
let currentGrainIsAtRest = false;
let totalGrainsAtRest = 0;

while (!sandHasReachedTheTop) {
    let currentGrainPos: Coords = { x: fallStartX, y: fallStartY };
    let prevGrainPos: Coords = undefined!;
    currentGrainIsAtRest = false;
    while (!currentGrainIsAtRest && !sandHasReachedTheTop) {
        let pointAtDest = "";
        let foundPosition = false;
        for (const fd of fallDirections) {
            let dest = { x: currentGrainPos.x + fd.x, y: currentGrainPos.y + fd.y };
            pointAtDest = screen.getPoint(dest);

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
        if (!foundPosition && !sandHasReachedTheTop) {
            // grain is at rest
            currentGrainIsAtRest = true;
            screen.drawPoint(currentGrainPos, GRAIN_AT_REST);
            totalGrainsAtRest++;
            if(totalGrainsAtRest % 100 === 0)
                screen.print();
            
            if (areEqual(currentGrainPos, { x: fallStartX, y: fallStartY })) {
                sandHasReachedTheTop = true;
            }
        }
    }
}

console.log("Grains at rest: " + totalGrainsAtRest);
screen.print();
console.log("Part2 result: " + totalGrainsAtRest);
