import { DijkstraMap } from "./dijkstra";

export function findPathValue(maxSteps: number, allDijkstra: DijkstraMap[], startNode: string, path: string[], fromStep: number) {
    let currentNode = startNode;
    let steps = fromStep;

    const toReturn = {
        accumulatedFlowRate: 0,
        spentSteps: 0
    };

    for (let destination of path) {
        const pathLength = allDijkstra[steps][currentNode].distances[destination];
        const flowRate = allDijkstra[steps][currentNode].flowRates[destination];

        steps += pathLength + 1;

        if (steps > maxSteps)
            break;

        toReturn.spentSteps = steps;
        toReturn.accumulatedFlowRate += flowRate;

        currentNode = destination;
    }
    // console.log(JSON.stringify(path) + " spentSteps: " + toReturn.spentSteps + " flowRate: " + toReturn.accumulatedFlowRate);
    return toReturn;
}
