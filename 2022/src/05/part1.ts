import { moves, stacks } from "./input";
import { parseMove } from "./moveParser";

const allMoves = moves.split("\n");

for(const move of allMoves) {
    const pm = parseMove(move);
    for(let i = 0; i < pm.itemsToMove; i++)
        stacks[pm.to].push(stacks[pm.from].pop() || "");
}

var response = "";
for(const stack of stacks) {
    if (!stack)
        continue;
    response += stack[stack.length - 1];
}
console.log("Top of stacks: " + response);