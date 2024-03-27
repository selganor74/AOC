import { Node, NodeDict } from "./node";

export function getAllNodesWithValves(allNodes: NodeDict) {
    let allNodesWithValves: Node[] = [];
    for (let nodeId of Object.keys(allNodes)) {
        if (allNodes[nodeId].flowRate !== 0)
            allNodesWithValves.push(allNodes[nodeId]);
    }
    allNodesWithValves = allNodesWithValves.sort((a, b) => b.flowRate - a.flowRate);
    return allNodesWithValves;
}
