import { sections } from "./input";

function getRange(pair: string) {
    return pair.split("-").map(e => Number.parseInt(e));
}

function oneContainsTheOther(one: number[], other: number[]): boolean {
    return (one[0] >= other[0] && one[1] <= other[1]);
}

function rangesOverlaps(one: number[], other: number[]): boolean {
    return (one[1] >= other[0] && one[0] <= other[1] );
}

const allPairs = sections.split("\n");
let numberOfFullContained = 0;
let numberOfOverlapping = 0;

for (const pair of allPairs) {
    const assignments = pair.split(",");
    const range1 = getRange(assignments[0]);
    const range2 = getRange(assignments[1]);
    if (oneContainsTheOther(range1, range2) || oneContainsTheOther(range2, range1))
        numberOfFullContained++;

    if (rangesOverlaps(range1, range2))
        numberOfOverlapping++;
}
console.log("number of pairs containing one the other: " + numberOfFullContained);
console.log("number of pairs overlapping: " + numberOfOverlapping);