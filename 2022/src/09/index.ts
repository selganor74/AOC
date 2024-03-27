import { moves } from "./input";

const directions: { [direction: string]: { x: number, y: number } } = {
    "U": { x: 0, y: -1 },
    "D": { x: 0, y: 1 },
    "L": { x: -1, y: 0 },
    "R": { x: 1, y: 0 }
}


class Rope {
    public head = { x: 0, y: 0 };
    public tail = { x: 0, y: 0 };
    public tailMoves: { [coords: string]: number } = {};

    constructor() {
        this.markTailPosition();
    }

    markTailPosition() {
        this.tailMoves[this.tailCoords()] = 1;
    }

    tailCoords() {
        return this.tail.x + "|" + this.tail.y;
    }

    applyMove(move: string) {
        const tokens = move.split(" ");
        const direction = directions[tokens[0]];
        const length = Number.parseInt(tokens[1]);

        // console.log("move " + tokens[0] + " by " + length);
        for (let s = 0; s < length; s++) {
            this.head.x += direction.x;
            this.head.y += direction.y;

            const vector = this.getTensionVector();
            this.tail.x += vector.x;
            this.tail.y += vector.y;
            this.markTailPosition();

            //console.log("head: " + JSON.stringify(this.head));
            //console.log("tension: " + JSON.stringify(vector));
            //console.log("tail: " + JSON.stringify(this.tail));
        }
    }

    getTensionVector(): { x: number, y: number } {
        const toReturn = { x: 0, y: 0 };
        if (this.head.x - this.tail.x > 1) {
            toReturn.x = 1;
            toReturn.y = this.head.y - this.tail.y;
            return toReturn;
        }
        if (this.head.x - this.tail.x < -1) {
            toReturn.x = -1;
            toReturn.y = this.head.y - this.tail.y;
            return toReturn;
        }
        if (this.head.y - this.tail.y > 1) {
            toReturn.y = 1;
            toReturn.x = this.head.x - this.tail.x;
            return toReturn;
        }
        if (this.head.y - this.tail.y < -1) {
            toReturn.y = -1;
            toReturn.x = this.head.x - this.tail.x;
            return toReturn;
        }
        return toReturn;
    }

    getTailTouchedPositions() {
        return Object.keys(this.tailMoves).length;
    }
}

class LongRope {
    public nodes: { x: number, y: number }[] = [];
    public lastNodePositions: { [coords: string]: number } = {};

    constructor() {
        for (let i = 0; i < 10; i++) {
            this.nodes[i] = { x: 0, y: 0 }
        }
        this.markTailPosition();
    }

    markTailPosition() {
        this.lastNodePositions[this.tailCoords()] = 1;
    }

    tailCoords() {
        return this.nodes[9].x + "|" + this.nodes[9].y;
    }

    applyMove(move: string) {
        const tokens = move.split(" ");
        const direction = directions[tokens[0]];
        const length = Number.parseInt(tokens[1]);

        //console.log("move " + tokens[0] + " by " + length);
        for (let s = 0; s < length; s++) {
            const head = this.nodes[0];
            head.x += direction.x;
            head.y += direction.y;
            for (let i = 1; i < 10; i++) {
                const localHead = this.nodes[i - 1];
                const localTail = this.nodes[i];
                const vector = this.getTensionVector(localHead, localTail);
                //console.log(" [" + i + "] localHead: " + JSON.stringify(localHead));
                //console.log(" [" + i + "] tension: " + JSON.stringify(vector));
                //console.log(" [" + i + "] localTail: " + JSON.stringify(localTail));
                localTail.x += vector.x;
                localTail.y += vector.y;
            }

            this.markTailPosition();
        }
    }

    getTensionVector(localHead: { x: number, y: number }, localTail: { x: number, y: number }): { x: number, y: number } {
        const toReturn = { x: 0, y: 0 };
        if (localHead.x - localTail.x > 1) {
            toReturn.x = 1;
            toReturn.y = Math.sign(localHead.y - localTail.y);
            return toReturn;
        }
        if (localHead.x - localTail.x < -1) {
            toReturn.x = -1;
            toReturn.y = Math.sign(localHead.y - localTail.y);
            return toReturn;
        }
        if (localHead.y - localTail.y > 1) {
            toReturn.y = 1;
            toReturn.x = Math.sign(localHead.x - localTail.x);
            return toReturn;
        }
        if (localHead.y - localTail.y < -1) {
            toReturn.y = -1;
            toReturn.x = Math.sign(localHead.x - localTail.x);
            return toReturn;
        }
        // if(found > 1)
        //     throw new Error("\nlocalHead:" + JSON.stringify(localHead) 
        //                 + "\nlocalTail:" + JSON.stringify(localTail)
        //                 + "\nvector:" + JSON.stringify(toReturn)
        //                 );
        return toReturn;
    }

    getTailTouchedPositions() {
        return Object.keys(this.lastNodePositions).length;
    }
}



const allMoves = moves.split("\n");
const rope = new Rope();
const longRope = new LongRope();
for (const move of allMoves) {
    rope.applyMove(move);
    longRope.applyMove(move);
}

const tailTouchedPositions = rope.getTailTouchedPositions();
console.log("Touched positions by Tail: " + tailTouchedPositions);

const longTailTouchedPositions = longRope.getTailTouchedPositions();
console.log("Touched positions by Long Tail: " + longTailTouchedPositions);