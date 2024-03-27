import { DijkstraMap } from "./dijkstra";
import { NodeDict, Node } from "./node";

export type ExplorationResult = {
    spentSteps: number,
    flowRate: number
    path: Node[]
}

export function findPathExhaustive(
    maxSteps: number,
    allNodes: NodeDict,
    allNodeWithValves: Node[],
    currentNode: Node,
    allDij: DijkstraMap[],
    path?: Node[],
    step: number = 0,
    accumulatedFlowRate: number = 0
) : ExplorationResult[] {

    path = path || [];

    let bestResults: ExplorationResult[] = [{
        spentSteps: step,
        flowRate: accumulatedFlowRate,
        path: path
    }];

    if (step >= maxSteps)
        return bestResults;

    const reachableElements = allNodeWithValves.filter(potentialDestination =>
        potentialDestination.name !== currentNode.name
        && allDij[step][currentNode.name].distances[potentialDestination.name] + step < maxSteps);

    let bestAccumulatedFR = 0;

    const remainingNodes = allNodeWithValves.concat();
    if (remainingNodes.indexOf(currentNode) !== -1)
        remainingNodes.splice(remainingNodes.indexOf(currentNode), 1);

    for (let destination of reachableElements) {
        const newSteps = step + 1 + allDij[step][currentNode.name].distances[destination.name];
        const newAccumulatedFR = accumulatedFlowRate + allDij[step][currentNode.name].flowRates[destination.name];

        let pathResults = findPathExhaustive(maxSteps, allNodes, remainingNodes, destination, allDij, path.concat(destination), newSteps, newAccumulatedFR);

        if (pathResults.length !== 0) {

            if (pathResults[0].flowRate === bestAccumulatedFR)
                bestResults.push(...pathResults);

            if (pathResults[0].flowRate > bestAccumulatedFR) {
                bestResults = pathResults.concat();
                bestAccumulatedFR = pathResults[0].flowRate;
            }
        }
    }

    return bestResults;
}