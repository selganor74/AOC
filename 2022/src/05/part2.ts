import { moves, stacks } from "./input";
import { parseMove } from "./moveParser";

const allMoves = moves.split("\n");

for(const move of allMoves) {
    const pm = parseMove(move);
    const tempStack : string[] = [];
    for(let i = 0; i < pm.itemsToMove; i++)
        tempStack.push(stacks[pm.from].pop() || "");

    for(let i = 0; i < pm.itemsToMove; i++)
        stacks[pm.to].push(tempStack.pop() || "");
}

var response = "";
for(const stackId in stacks) {
    const stack = stacks[stackId];
    if (!stack)
        continue;
    console.log("stackId: " + stackId);
    response += stack[stack.length - 1];
}
console.log("Top of stacks: " + response);