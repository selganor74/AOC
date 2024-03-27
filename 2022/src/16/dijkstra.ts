import { Node, NodeDict } from "./node";

export function reset(
    allNodes: NodeDict,
    dijkNodeDistances: { [name: string]: number | undefined; },
    dijkNodePrev: { [name: string]: string; },
    flowRates: { [name: string]: number; }) {
    for (const id in allNodes)
        dijkNodeDistances[id] = Number.MAX_VALUE;

    for (const id in allNodes)
        flowRates[id] = 0;

    for (const id in allNodes)
        dijkNodePrev[id] = "";
}

export function dijkstra(
    allNodes: NodeDict,
    startNodeName: string,
    distances: { [name: string]: number; },
    flowRates: { [name: string]: number; },
    prev: { [name: string]: string; },
    actualSteps: number,
    maxSteps: number
) {
    reset(allNodes, distances, prev, flowRates);
    
    const startNode = allNodes[startNodeName];
    let toVisit = [startNode];
    distances[startNodeName] = 0;
    let currentNode: Node;
    while (toVisit.length) {
        toVisit = toVisit.sort((a, b) => distances[a.name] - distances[b.name]);

        //console.log("toVisit: " + JSON.stringify(toVisit.map(e => e?.name)));
        currentNode = toVisit.shift()!;
        const currentNodeDist = distances[currentNode.name];
        // console.log("currentNode: " + currentNode.name + " (" + currentNodeDist + ")");
        //console.log("dikj: currentNode: " + currentNode.name);
        const destinations = currentNode.origSteps.filter(s => s.moveTo).map(s => s.moveTo!);
        for (const destName of destinations) {
            const dest = allNodes[destName];
            if (dest.name === startNode.name)
                continue;

            //console.log("dikj: destination: " + destName + " (" + distances[destName] + ")");
            const distanceSoFar = currentNodeDist + 1;
            if (distances[destName] > distanceSoFar) {
                toVisit.push(dest);
                distances[destName] = distanceSoFar;
                prev[destName] = currentNode.name;
                const remainingSteps = maxSteps - actualSteps;
                flowRates[destName] = dest.flowRate * (remainingSteps - (distanceSoFar + 1));
                // if (destName === "DD" && startNodeName === "JJ")
                //     console.log("DD.flowRate: " + dest.flowRate + " maxSteps: " + maxSteps + " actualSteps: " + actualSteps + " distanceSoFar: (" + distanceSoFar + " + 1) = " + flowRates[destName] )
            }
        }
    }
}

export type DijkstraMap = {
    [fromNode: string]: {
        distances: { [nodeName: string]: number },
        flowRates: { [nodeName: string]: number },
        prev: { [nodeName: string]: string }
    }
};

export function preCalculateDijkstra(allNodes: NodeDict, allNodeWithValves: string[], startNodeName: string, maxSteps: number) {
    console.log("Starting preCalculateDijkstra");
    console.time("preCalculateDijkstra");
    const toReturn: DijkstraMap[] = [];

    for (let step = 0; step <= maxSteps; step++) {
        // console.log("preCalc step " + step);
        toReturn[step] = {};

        let nodesToCompute: string[];
        if (step === 0) {
            nodesToCompute = [startNodeName];
        } else {
            nodesToCompute = allNodeWithValves.concat();
        }

        for (let node of nodesToCompute) {
            // console.log("preCalc step " + step + " node " + node);
            const distances: { [nodeName: string]: number } = {};
            const flowRates: { [nodeName: string]: number } = {};
            const prev: { [nodeName: string]: string } = {};

            reset(allNodes, distances, prev, flowRates);

            dijkstra(allNodes, node, distances, flowRates, prev, step, maxSteps);
            toReturn[step][node] = {
                distances: distances,
                flowRates: flowRates,
                prev: prev
            };
        }
    }

    console.timeEnd("preCalculateDijkstra");
    return toReturn;
}
