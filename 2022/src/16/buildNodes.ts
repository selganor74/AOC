import { Node, NodeDict } from "./node";

export function buildNodes(valveMapInput: string) {
    const allMapRows = valveMapInput.split("\n");
    const allNodes: NodeDict = {};

    for (const row of allMapRows) {
        // Valve GV has flow rate=23; tunnel leads to valve WO
        const splitted = row.split("; ");
        const nodeToAdd = parseNode(splitted[0]);
        allNodes[nodeToAdd.name] = nodeToAdd;

        const leadsTo = parsePaths(splitted[1]);
        for (const d of leadsTo)
            allNodes[nodeToAdd.name].addDest(d);
    }

    return allNodes;
}

function parseNode(leftSide: string): Node {
    // Valve GV has flow rate=23
    //   0    1  2    3      4
    const splitted = leftSide.split(" ");
    const name = splitted[1];
    const rate = Number.parseInt(splitted[4].split("=")[1]);
    return new Node(name, rate);
}

function parsePaths(rightSide: string): string[] {
    // tunnel leads to valve WO
    // tunnels lead to valves MI, QY, DO, QJ, YH
    const toReturn = [] as string[];
    const splitted = rightSide.split(" ");
    for (let i = 4; i < splitted.length; i++) {
        const name = splitted[i].substring(0, 2);
        toReturn.push(name);
    }
    return toReturn;
}
