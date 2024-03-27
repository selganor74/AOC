import { buildNodes } from "./buildNodes";
import { preCalculateDijkstra } from "./dijkstra";
import { findPathExhaustive } from "./find-path-exhaustive";
import { findPathValue } from "./findPathValue";
import { getAllNodesWithValves } from "./getAllNodesWithValves";
import { part2Solution } from "./part2-solution";
import { bestPathFlowRate, startNodeName, valveMap } from "./test_input";

const allNodes = buildNodes(valveMap);
const allNodesWithValves = getAllNodesWithValves(allNodes);

const dij = preCalculateDijkstra(allNodes, allNodesWithValves.map(n => n.name), startNodeName, 30);

const result = findPathExhaustive(30, allNodes, allNodesWithValves, allNodes[startNodeName], dij);

result.map(br => {
    console.log("BEST flowRate: " + br.flowRate + " steps: " + br.spentSteps + " path: " + br.path.map(p => p.name));
});

const bestPathFR = result[0].flowRate;

if(result[0].flowRate !== 1651)
    throw new Error("The best path found should be " + bestPathFlowRate + " but was " + bestPathFR );

const dij2 = preCalculateDijkstra(allNodes, allNodesWithValves.map(n => n.name), startNodeName, 26);

const bestResult2 = part2Solution(startNodeName, allNodes, allNodesWithValves);
console.log("Part2 BEST flowRate: " + bestResult2!.flowRate
    + " elf flow reate: " + bestResult2!.elfFlowRate
    + " TOTAL FLOW RATE: " + (bestResult2!.flowRate + bestResult2!.elfFlowRate)
    + " elephant steps: " + bestResult2!.spentSteps 
    + " elf steps: " + bestResult2!.elfSpentSteps 
    + " path: " + bestResult2!.path.map(p => p.name) 
    + " elf path: " + bestResult2!.elfPath.map(p => p.name)
);
const part2BestFlowRate = bestResult2.flowRate;
const part2BestPathFlowRate = 1707

if(bestResult2.flowRate + bestResult2.elfFlowRate !== part2BestPathFlowRate)
    throw new Error("The best paths found working with an elephant should be " + part2BestPathFlowRate + " but was " + part2BestFlowRate );
