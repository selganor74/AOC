import { terrain } from "./input";

type Coords = { x: number; y: number, printAs?: string }

const terrainRows = terrain.split("\n");
const map: number[][] = [];
const mapSize: Coords = { x: terrainRows[0].length, y: terrainRows.length };
let start: Coords;
let end: Coords;

const directions: { [d: string]: Coords } = {
    "R": { x: 1, y: 0 },
    "U": { x: 0, y: -1 },
    "D": { x: 0, y: 1 },
    "L": { x: -1, y: 0 },
}

function getElevation(char: string) {
    const min = "a".charCodeAt(0);
    return char.charCodeAt(0) - min + 1;
}

function coordsAsString(p: Coords) {
    return p.x + "|" + p.y;
}

function coordsToLinear(p: Coords): number {
    // The + 1 at the end is the "\n" at the end of each row
    const yContribution = p.y * (mapSize.x + 1);
    const xContribution = p.x;

    return xContribution + yContribution;
}

function printPath(path: Coords[]) {
    let map = terrain;
    console.log("Path len: " + (path.length - 1));
    for (let pId = 0; pId < path.length; pId++) {
        const p = path[pId];
        const linearCoord = coordsToLinear(p);
        map = map.slice(0, linearCoord) + (p.printAs || "⬤") + map.slice(linearCoord + 1);
    }
    console.log(map);
    console.log("\n\n");
}

// Replaces letters with numeric values for elevations, and identifies the start and end points.
function buildMap() {
    for (let y = 0; y < terrainRows.length; y++) {
        for (let x = 0; x < terrainRows[y].length; x++) {
            map[x] = map[x] || [];
            const current = terrainRows[y].charAt(x);
            if (current === "S")
                start = { x: x, y: y, printAs: "Ⓢ" };
            if (current === "E")
                end = { x: x, y: y, printAs: "Ⓔ" };

            const elevation = current === "S" ? getElevation("a") : current === "E" ? getElevation("z") : getElevation(current);
            map[x][y] = elevation;
        }
    }
}

class Node {
    public connected: { [pos: string]: Node } = {}
    public distance: number = Number.MAX_VALUE;
    public prev: Node | undefined = undefined;
    constructor(
        public pos: Coords
    ) { }

    add(n: Node) {
        this.connected[coordsAsString(n.pos)] = this.connected[coordsAsString(n.pos)] || n;
    }
}

const allNodes: { [pos: string]: Node } = {};

function buildNodes(from: Node) {
    allNodes[coordsAsString(from.pos)] = allNodes[coordsAsString(from.pos)] || from;

    const fromElevation = map[from.pos.x][from.pos.y];

    for (const dirId in directions) {
        const dir = directions[dirId];
        const dest: Coords = { x: from.pos.x + dir.x, y: from.pos.y + dir.y, printAs: "█" };

        if (!(map[dest.x] && map[dest.x][dest.y]))
            continue;

        const destElevation = map[dest.x][dest.y];

        if (destElevation - fromElevation > 1)
            continue;

        const toAdd = allNodes[coordsAsString(dest)] || new Node(dest);
        allNodes[coordsAsString(dest)] = allNodes[coordsAsString(dest)] || toAdd;
        from.add(toAdd);
    }
}

function resetNodes(allNodes: { [pos: string]: Node }) {
    for (const pos in allNodes) {
        const current = allNodes[pos];
        current.prev = undefined;
        current.distance = Number.MAX_VALUE;
    }
}

function findPaths(allNodes: { [pos: string]: Node }, source: Node, destination: Node) {
    resetNodes(allNodes);
    source.distance = 0;
    let toBeProcessed: Node[] = [source];

    while (toBeProcessed.length) {
        toBeProcessed = toBeProcessed.sort((a, b) => a.distance - b.distance);
        const current = toBeProcessed.shift()!;
        //console.log("analyzing " + JSON.stringify( current.pos ) );
        for (const pos in current.connected) {
            const neighbor = current.connected[pos];
            //console.log("neighbor " + JSON.stringify( pos ) );
            if (neighbor === source)
                continue;

            if (neighbor === destination) {
                // We found a solution !
                neighbor.prev = current;
                let backTrackCurrent = neighbor;
                const path: Coords[] = [backTrackCurrent.pos];
                while (backTrackCurrent.prev) {
                    backTrackCurrent = backTrackCurrent.prev;
                    path.push(backTrackCurrent.pos);
                }
                printPath(path);
                // path contains all the "nodes" comprising Start and End. 
                // We need the arcs (the "steps"), hence the - 1!
                return path.length - 1;
            }

            const distanceSoFar = current.distance + 1;
            if (distanceSoFar < neighbor.distance) {
                neighbor.distance = distanceSoFar
                neighbor.prev = current;
                toBeProcessed.push(neighbor);
            }
        }
    }
}

buildMap();

for (let x = 0; x < mapSize.x; x++) {
    for (let y = 0; y < mapSize.y; y++) {
        const p: Coords = { x: x, y: y };
        const node = allNodes[coordsAsString(p)] || new Node(p);
        buildNodes(node);
    }
}

const startNode = allNodes[coordsAsString(start!)]!;
const endNode = allNodes[coordsAsString(end!)]!;
const part1PathLength = findPaths(allNodes, startNode, endNode);

let part2Lengths: { [pos: string]: number } = {};
// all "plausible" a to start from are those on the first column !!!
for (let y = 0; y < mapSize.y; y++) {
    let startPoint = { x: 0, y: y };
    let spas = coordsAsString(startPoint);
    let startNode = allNodes[spas];
    part2Lengths[spas] = findPaths(allNodes, startNode, endNode) || Number.MAX_VALUE;
}

let part2MinLength: number = Number.MAX_VALUE;
let part2StartPos: string
for (let p in part2Lengths) {
    if (part2Lengths[p] < part2MinLength) {
        part2MinLength = part2Lengths[p];
        part2StartPos = p;
    }
}
console.log("part1 shortest path: " + part1PathLength);
console.log("part2 shortest path: " + part2MinLength + " starting from: " + part2StartPos!);

