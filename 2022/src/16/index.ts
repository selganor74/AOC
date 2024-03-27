import { startNodeName, valveMap } from "./input";
import { Node } from "./node";
import { buildNodes } from "./buildNodes";
import { preCalculateDijkstra } from "./dijkstra";
import { getAllNodesWithValves } from "./getAllNodesWithValves";
import { findPathExhaustive } from "./find-path-exhaustive";
import { ExplorationResultPart2, part2Solution } from "./part2-solution";

export const allNodes = buildNodes(valveMap);

export let allNodesWithValves: Node[] = getAllNodesWithValves(allNodes);

export const allDijkstra = preCalculateDijkstra(allNodes, allNodesWithValves.map(n => n.name), startNodeName, 30);

const result = findPathExhaustive(30, allNodes, allNodesWithValves, allNodes[startNodeName], allDijkstra);

result.map(br => {
    console.log("Part1 BEST flowRate: " + br.flowRate + " steps: " + br.spentSteps + " path: " + br.path.map(p => p.name));
});

// ---------- PART 2 ------------

let bestResult: ExplorationResultPart2 = part2Solution(startNodeName, allNodes, allNodesWithValves);

console.log("Part2"  
    + " flowRate: " + (bestResult!.flowRate + bestResult!.elfFlowRate)
    + " steps: " + (bestResult!.spentSteps + bestResult!.elfSpentSteps) 
    + " path: " + bestResult!.path.map(p => p.name) 
    + " elf path: " + bestResult!.elfPath.map(p => p.name)
);
