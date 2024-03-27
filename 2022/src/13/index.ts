import { packetPairs } from "./input";

type Packet = (number | Packet)[];
type PacketPair = { left: Packet, right: Packet };
type PacketItem = { id: string; packet: Packet };

const inputRows = packetPairs.split("\n");
const allPairs: PacketPair[] = [];
const allPackets: Packet[] = [];
const divider1: Packet = [[2]];
const divider2: Packet = [[6]];
allPackets.push(divider1);
allPackets.push(divider2);

let next: keyof (PacketPair) = "left";
let pairId = 1;
for (let row of inputRows) {
    if (row === "")
        continue;

    let toAdd = eval(row) as Packet;
    allPackets.push(toAdd);
    allPairs[pairId] = allPairs[pairId] || <any>{};
    allPairs[pairId][next] = toAdd;
    if (next === "right")
        pairId++;
    next = next === "left" ? "right" : "left";
}
// console.log(JSON.stringify(allPairs));

function isArray(toTest: number | Packet) {
    return typeof toTest !== "number";
}

type RightOrderCheckResult = "rightOrder" | "wrongOrder" | "continue"
function isInRightOrder(left: Packet | number, right: Packet | number, depth: number = 0): RightOrderCheckResult {
    depth += 2;

    // console.log(" ".repeat(depth) + "|Testing: ");
    // console.log(" ".repeat(depth) + "|  left: " + JSON.stringify(left));
    // console.log(" ".repeat(depth) + "| right: " + JSON.stringify(right));

    let result: RightOrderCheckResult;
    if (!isArray(left) && !isArray(right)) {
        if (left === right) result = "continue";
        if (left < right) result = "rightOrder";
        if (left > right) result = "wrongOrder";
    }

    if (isArray(left) && isArray(right)) {
        const leftArray = left as [];
        const rightArray = right as [];

        let mightReturn: RightOrderCheckResult = "continue";
        if (leftArray.length < rightArray.length)
            mightReturn = "rightOrder"
        if (leftArray.length > rightArray.length)
            mightReturn = "wrongOrder"

        // console.log(" ".repeat(depth) + "|mightReturn: " + mightReturn + "( leftArray.length: " + leftArray.length + ", rightArray.lenght: " + rightArray.length + ")");
        const minLength = Math.min(leftArray.length, rightArray.length);
        let found = false;
        for (let i = 0; i < minLength; i++) {
            result = isInRightOrder(leftArray[i], rightArray[i], depth);
            if (result !== "continue") {
                found = true;
                break;
            }
        }
        result = found ? result! : mightReturn;
    }

    if (!isArray(left) && isArray(right)) {
        result = isInRightOrder([left], right, depth);
    }

    if (isArray(left) && !isArray(right)) {
        result = isInRightOrder(left, [right], depth);
    }

    // console.log(" ".repeat(depth) + "|-> " + result!);
    return result!;
}

let part1Result = 0;
for (let pairId = 1; pairId < allPairs.length; pairId++) {
    const currentPair = allPairs[pairId];
    // get rid of element 0!
    if (!currentPair)
        continue;
    const rightOrWrong = isInRightOrder(currentPair.left, currentPair.right);
    if (rightOrWrong === "rightOrder") {
        part1Result += pairId;
    }
    if (rightOrWrong === "continue")
        throw new Error("This must not happen")!
}

console.log("Part1 result: " + part1Result);

const ordered = allPackets.sort((a, b) => isInRightOrder(a, b) === "rightOrder" ? -1 : 1);
const id1 = ordered.indexOf(divider1) + 1;
const id2 = ordered.indexOf(divider2) + 1;
const part2Result = id1 * id2;
// for(const o of ordered)
//     console.log(JSON.stringify(o));
console.log("Part2 result: " + part2Result + " id1: " + id1 + " id2: " + id2);
