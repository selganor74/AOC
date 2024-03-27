import { allMonkeys } from "./input";


const inspections: number[] = [];
for (let round = 1; round <= 20; round++) {
    for (let mId in allMonkeys) {
        //console.log("R O U N D: " + round + " MONKEY:" + mId);
        inspections[mId] = inspections[mId] || 0;
        inspections[mId] += allMonkeys[mId].playTurn();
        //console.log("R O U N D: " + round + " MONKEY:" + mId + " Inspections: " + inspections[mId]);
    }
}

const ordered = inspections.sort((a, b) => Math.sign(b - a));
const levelOfMonkeyBusiness = ordered[0] * ordered[1];
console.log("All monkey business: " + JSON.stringify(ordered));
console.log("Level of monkey business: " + levelOfMonkeyBusiness);
