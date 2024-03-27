import { Node, NodeDict } from "./node";
import { ExplorationResult, findPathExhaustive } from "./find-path-exhaustive";
import { SetsOfNElements } from "./sets-of-n-elements";
import { preCalculateDijkstra } from "./dijkstra";

export type ExplorationResultPart2 = ExplorationResult & { elfPath: Node[]; elfFlowRate: number; elfSpentSteps: number };

export function part2Solution(startNodeName: string, allNodes: NodeDict, allNodesWithValves: Node[]) {
    
    let bestFlowRate = 0;
    let bestResult: ExplorationResultPart2;
    
    const part2MaxSteps = 26;
    const allDijkstra = preCalculateDijkstra(allNodes, allNodesWithValves.map(n => n.name), startNodeName, part2MaxSteps);

    for (let elephantDests = 1; elephantDests <= allNodesWithValves.length / 2; elephantDests++) {
        const allSets = new SetsOfNElements(allNodesWithValves, elephantDests);
        for (const elephantSet of allSets) {
            const elfSet = allNodesWithValves.filter(e => elephantSet.indexOf(e) === -1);

            const elephantResult = findPathExhaustive(part2MaxSteps, allNodes, elephantSet, allNodes[startNodeName], allDijkstra);
            const elfResult = findPathExhaustive(part2MaxSteps, allNodes, elfSet, allNodes[startNodeName], allDijkstra);

            const result: ExplorationResultPart2 = {
                flowRate: elephantResult[0].flowRate,
                elfFlowRate: elfResult[0].flowRate,
                spentSteps: elephantResult[0].spentSteps,
                elfSpentSteps: elfResult[0].spentSteps,
                path: elephantResult[0].path,
                elfPath: elfResult[0].path
            };

            if (result.flowRate + result.elfFlowRate > bestFlowRate) {
                bestResult = result;
                bestFlowRate = result.flowRate + result.elfFlowRate;
            }
        }
    };
    return bestResult!;
}
