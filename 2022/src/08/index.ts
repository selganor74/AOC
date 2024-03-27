import { trees } from "./input";

function isVisibileFromLeft(row: string, position: number): boolean {
    const valAtPos = Number.parseInt(row.charAt(position));
    let currPos = 0;
    while (currPos < position) {
        const currVal = Number.parseInt(row.charAt(currPos));
        if (currVal >= valAtPos)
            return false;

        currPos++;
    }
    return true;
}

function isVisibileFromRight(row: string, position: number): boolean {
    const valAtPos = Number.parseInt(row.charAt(position));
    let currPos = row.length - 1;
    while (currPos > position) {
        const currVal = Number.parseInt(row.charAt(currPos));
        if (currVal >= valAtPos)
            return false;

        currPos--;
    }
    return true;
}

function getLeftScenicScore(row: string, position: number): number {
    const valAtPos = Number.parseInt(row.charAt(position));

    let currPos = position - 1;
    let counter = 0;
    while (currPos >= 0) {
        counter++;
        const currVal = Number.parseInt(row.charAt(currPos));
        if (currVal >= valAtPos)
            break;
        currPos--;
    }
    return counter;
}

function getRightScenicScore(row: string, position: number): number {
    const valAtPos = Number.parseInt(row.charAt(position));

    let currPos = position + 1;
    let counter = 0;
    while (currPos < row.length) {
        counter++;
        const currVal = Number.parseInt(row.charAt(currPos));
        if (currVal >= valAtPos)
            break;
        currPos++;
    }
    return counter;
}

function isVisible(y: number, x: number) {
    if (isVisibileFromLeft(treeRows[y], x)) {
        visibles[x][y] = 1;
        return;
    }
    if (isVisibileFromRight(treeRows[y], x)) {
        visibles[x][y] = 1;
        return;
    }
    if (isVisibileFromLeft(treeColumns[x], y)) {
        visibles[x][y] = 1;
        return;
    }
    if (isVisibileFromRight(treeColumns[x], y)) {
        visibles[x][y] = 1;
        return;
    }
}

function computeScenicScore(x: number, y: number) : number {
    const scenicScoreLeft = getLeftScenicScore(treeRows[y], x);
    const scenicScoreRight = getRightScenicScore(treeRows[y], x);
    const scenicScoreTop = getLeftScenicScore(treeColumns[x], y);
    const scenicScoreBottom = getRightScenicScore(treeColumns[x], y);

    const scenicScore = scenicScoreBottom * scenicScoreLeft * scenicScoreRight * scenicScoreTop;
    console.log("x: " + x + " y: " + y + " score: " + scenicScore);
    return scenicScore;
}

const treeRows = trees.split("\n");
const treeColumns: string[] = [];
const visibles: number[][] = [];
// const scenicScores: number[][] = [];

for (let i = 0; i < treeRows[0].length; i++) {
    for (const row of treeRows) {
        treeColumns[i] = treeColumns[i] || "";
        treeColumns[i] += row.charAt(i);
    }
}

const sizeX = treeRows[0].length;
const sizeY = treeColumns[0].length;
const totalTrees = sizeX * sizeY;

let maxScenicScore = 0;
for (let x = 0; x < sizeX; x++) {
    for (let y = 0; y < sizeY; y++) {
        visibles[x] = visibles[x] || [];
        visibles[x][y] = 0;
        
        isVisible(y, x);

        let currScenicScore = computeScenicScore(x, y);
        maxScenicScore = maxScenicScore < currScenicScore ? currScenicScore : maxScenicScore;
    }
}

let totalVisibles = 0;
for (let x = 0; x < sizeX; x++) {
    totalVisibles += visibles[x].reduce((p, c) => p + c, 0);
}
console.log("SizeX: " + sizeX);
console.log("SizeY: " + sizeY);
console.log("Total Trees: " + totalTrees);
console.log("Total visible trees: " + totalVisibles);
console.log("Max scenic score: " + maxScenicScore);
