import { Coords, Dimension } from "./coords";
import { rowToTest, sensorsAndBeacons } from "./input";

function extractCoord(sensorOrBeacon: string): Coords {
    const splitted = sensorOrBeacon.split(" ");
    const p: Coords = {} as Coords;
    for (const t of splitted) {
        const dimension: Dimension = t.charAt(0) as Dimension;

        if (dimension === "x" || dimension === "y") {
            const values = t.split("=");
            p[dimension] = Number.parseInt(values[1]);
        }
    }
    return p;
}

function manhattamDistance(from: Coords, to: Coords): number {
    const xContribute = Math.abs(to.x - from.x);
    const yContribute = Math.abs(to.y - from.y);
    return xContribute + yContribute;
}

type Range = { from: number, to: number };
type RangeRows = { [row: string]: Range[] };
type SensorBeaconPair = { sensor: Coords, beacon: Coords, distance: number };
const allInputRows = sensorsAndBeacons.split("\n");
const allSensorsBeaconPairs: SensorBeaconPair[] = [];
const min: Coords = { x: Number.MAX_VALUE, y: Number.MAX_VALUE };
const max: Coords = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };
const area: RangeRows = {} as RangeRows;

for (const row of allInputRows) {
    const sensorAndBeacon = row.split(":");
    const sensor = extractCoord(sensorAndBeacon[0]);
    const beacon = extractCoord(sensorAndBeacon[1]);
    allSensorsBeaconPairs.push({ sensor: sensor, beacon: beacon, distance: manhattamDistance(sensor, beacon) });

    min.x = Math.min(min.x, sensor.x, beacon.x);
    min.y = Math.min(min.y, sensor.y, beacon.y);
    max.x = Math.max(max.x, sensor.x, beacon.x);
    max.y = Math.max(max.y, sensor.y, beacon.y);
}

const sizeX = max.x - min.x;
const sizeY = max.y - min.y;

console.log(JSON.stringify(min));
console.log(JSON.stringify(max));
console.log("sizeX: " + sizeX + " sizeY: " + sizeY);

function rangesSize(rs: Range[]): number {
    let toReturn = 0;
    for (const r of rs)
        toReturn += (r.to - r.from + 1);
    return toReturn;
}

function mergeRanges(rs: Range[]): Range[] {
    const toReturn = [] as Range[];
    let toMerge = rs.sort((a, b) => a.from - b.from);
    while (toMerge.length) {
        const current = toMerge.shift()!;
        const overlapping = toMerge.filter(t => t.from <= current.to && t.to >= current.from);

        if (overlapping.length === 0) {
            toReturn.push(current);
            continue;
        }

        let resulting: Range = { from: Number.MAX_VALUE, to: Number.MIN_VALUE };
        for (let oe of overlapping) {
            resulting = {
                from: Math.min(resulting.from, current.from, oe.from),
                to: Math.max(resulting.to, current.to, oe.to)
            };
            const splitPoint = toMerge.indexOf(oe);
            toMerge = toMerge.slice(0, splitPoint).concat(toMerge.slice(splitPoint + 1));
        }
        toMerge.push(resulting!);
    }
    return toReturn;
}

function drawLine(area: RangeRows, from: Coords, to: Coords, obstacles: Coords[]) {
    if (from.y < 0 || from.y > 4000000)
        return;

    if (to.x < 0 || from.x > 4000000)
        return;

    if(from.x < 0) from.x = 0;
    if(to.x > 4000000) to.x = 4000000;

    //console.log("drawing line from: " + JSON.stringify(from) + " to:" + JSON.stringify(to));

    area[from.y] = area[from.y] || [];
    area[from.y].push({ from: Math.min(from.x, to.x), to: Math.max(from.x, to.x) });
    area[from.y] = mergeRanges(area[from.y]);

    //console.log(area[from.y]);
}

function fillArea(area: RangeRows, center: Coords, distance: number, obstacles: Coords[]) {
    let rowLen = 0;
    let yPos = center.y - distance;
    let xPos = center.x;
    console.log("filling area: " + JSON.stringify(center) + " distance: " + distance)
    drawLine(area, { x: xPos, y: yPos }, { x: xPos + rowLen, y: yPos }, obstacles);

    while (yPos < center.y + distance) {
        // console.log("  yPos: " + yPos + "/" + (center.y + distance));
        const xIncrement = yPos < center.y ? 1 : -1;
        //console.log(xPos + " " + yPos)
        xPos -= xIncrement;
        yPos++;
        rowLen += 2 * xIncrement;
        drawLine(area, { x: xPos, y: yPos }, { x: xPos + rowLen, y: yPos }, obstacles);
        if (rowLen <= 0)
            break;
    }
}

const beaconsInRowToTest = allSensorsBeaconPairs.map(bp => bp.beacon).filter(b => b.y === rowToTest).sort((a, b) => a.x - b.x);
for (let i = beaconsInRowToTest.length - 1; i >= 1; i--) {
    let curr = beaconsInRowToTest[i];
    let next = beaconsInRowToTest[i - 1];
    if (curr.x === next.x)
        beaconsInRowToTest.splice(i, 1);
}
const sensorsInRowToTest = allSensorsBeaconPairs.map(bp => bp.sensor).filter(s => s.y === rowToTest);
const allObstacles = sensorsInRowToTest.concat(beaconsInRowToTest);
console.log(allObstacles);

for (const pair of allSensorsBeaconPairs) {
    fillArea(area, pair.sensor, pair.distance, allObstacles);
}
let solution: Range[];
for (let rowId in area) {
    if (area[rowId].length > 1) {
        solution = area[rowId].sort((a,b) => a.from - b.from);
        console.log(rowId + " ", area[rowId]);
        const y = Number.parseInt(rowId);
        const x = solution[0].to + 1;
        const tuningFrequency = x * 4000000 + y;
        console.log("part2 response: " + tuningFrequency) 
    }
}

// console.log("Part1 response: " + part1response);