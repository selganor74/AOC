import { InfiniteArrayIterator, Iteration } from "./infinite-array-iterator";
import { Shape } from "./shape";
import { Point } from "./point";

export class Chamber {
    private readonly roomWidth = 7;
    // Rooms Bottom left coordinate is 0,0
    private readonly fallStartFromBottom = 3;
    private readonly fallStartFromLeft = 2;
    private readonly maxScreenHeight = 500;
    private readonly screenHeigthToRemove = 200;
    private screenFloorBase = 0;

    private currentRockBottomLeftPosition!: Point;
    private currentFallingShape!: Shape;
    private fallenRocks = 0;

    private rocksIterator: Generator<Iteration<Shape>, Iteration<Shape>, unknown>;
    private jetFlowPatternIterator: Generator<Iteration<string>, Iteration<string>, unknown>;

    private topRockLevel = 0; // starts from ground
    private roomFloor = "#".repeat(this.roomWidth + 2);
    private roomSliceTemplate = "#" + ".".repeat(this.roomWidth) + "#";
    private room: string[] = [];

    private roomSize = new Point(this.roomWidth, 0);
    private currentFallingShapeIteration!: Iteration<Shape>;

    constructor(
        private jetFlowPattern: string,
        rockShapes: Shape[],
        private stopAfterNumRocks: number = 6
    ) {
        this.rocksIterator = new InfiniteArrayIterator(rockShapes)[Symbol.iterator]();
        this.jetFlowPatternIterator = new InfiniteArrayIterator(jetFlowPattern.split(""))[Symbol.iterator]();
    }

    private addRow() {
        this.room.push(this.roomSliceTemplate);
        this.roomSize = this.roomSize.plus(new Point(0, 1));
        if (this.room.length > this.maxScreenHeight) {
            this.screenFloorBase += this.screenHeigthToRemove;
            this.room.splice(0, this.screenHeigthToRemove);
        }
    }

    private getRoomContentAt(point: Point): "#" | "." {
        const row = this.room[point.y + 1 - this.screenFloorBase] || this.roomSliceTemplate;
        if (row.length <= point.x + 1 || point.x + 1 < 0)
            return "#";

        return <any>(row.charAt(point.x + 1));
    }

    private setRoomContentAt(point: Point, newContent: "#" | ".") {
        let row = this.room[point.y + 1 - this.screenFloorBase];
        row = row.slice(0, point.x + 1) + newContent + row.slice(point.x + 2);
        this.room[point.y + 1] = row;
    }

    private collides(shape: Shape, bottomLeftCorner: Point) {
        for (let row = 0; row < shape.height; row++) {
            for (let column = 0; column < shape.width; column++) {
                const internalPoint = new Point(column, row);
                const pointToCheck = bottomLeftCorner.plus(internalPoint);
                const roomAt = this.getRoomContentAt(pointToCheck);
                const shapeAt = shape.getShapeContentAt(internalPoint);
                // console.log("checking room coords: " + pointToCheck.toString() + " shape coords: " + internalPoint);
                // console.log("shape: " + shapeAt + " roomAt: " + roomAt);

                if (roomAt === "." || shapeAt === ".")
                    continue;
                if (roomAt === "#" && shapeAt === "#")
                    return true;
            }
        }
        return false;
    }

    prepareNextShape() {
        // this.printRoom();
        this.currentFallingShapeIteration = this.rocksIterator.next().value;
        this.currentFallingShape = this.currentFallingShapeIteration.current;
        this.currentRockBottomLeftPosition = new Point(this.fallStartFromLeft, this.fallStartFromBottom + this.topRockLevel);

        // adjust the room size to contain the whole shape.
        let topCoord = this.currentFallingShape.getTopCoordinate(this.currentRockBottomLeftPosition) + 1;
        while (this.roomSize.y <= topCoord)
            this.addRow();

        // console.log("new rock falling @ " + this.currentRockBottomLeftPosition.toString());
        // console.log(this.currentFallingShape.toString());

        // console.log("");
        // this.printRoom();
    }

    start() {
        this.room.push(this.roomFloor);

        this.prepareNextShape();

        const moveDown = new Point(0, -1);
        let i = 0;
        while (this.fallenRocks <= this.stopAfterNumRocks) {
            i++;
            const flowDirectionIteration = this.jetFlowPatternIterator.next().value;
            const flowDirection = flowDirectionIteration.current;
            let moveLeftOrRight: Point;
            if (flowDirection === ">")
                moveLeftOrRight = new Point(1, 0);
            else
                moveLeftOrRight = new Point(-1, 0);

            // console.log("jet flow: " + flowDirection + " " + moveLeftOrRight.toString());

            const newHorizontalPosition = this.currentRockBottomLeftPosition.plus(moveLeftOrRight)
            if (!this.collides(this.currentFallingShape, newHorizontalPosition)) {
                this.currentRockBottomLeftPosition = newHorizontalPosition;
                // console.log("horizontal movement possible. New position: " + this.currentRockBottomLeftPosition.toString());
            } else {
                // console.log("horizontal movement NOT possible. remaining at position: " + this.currentRockBottomLeftPosition.toString());
            }


            const newVerticalPosition = this.currentRockBottomLeftPosition.plus(moveDown);
            if (this.collides(this.currentFallingShape, newVerticalPosition)) {
                // console.log("vertical movement NOT possible. fixing @ " + this.currentRockBottomLeftPosition.toString());
                this.fixShapeInPosition(this.currentFallingShape, this.currentRockBottomLeftPosition);
                this.prepareNextShape();

                if (flowDirectionIteration.position === 0 && this.currentFallingShapeIteration.position === this.jetFlowPattern.length - 1) {
                    // we start a new reptition after
                    console.log("Repetition starts at " + this.fallenRocks + " fallen rocks, topRockLevel: " + this.topRockLevel);
                }

                continue;
            } else {
                // console.log("vertical movement possible. falling @ " + this.currentRockBottomLeftPosition.toString());
                this.currentRockBottomLeftPosition = newVerticalPosition;
            }
        }

        console.log("Heigth after " + this.stopAfterNumRocks + " fallen rocks: " + this.topRockLevel);
        return this.topRockLevel;
    }

    fixShapeInPosition(shape: Shape, bottomLeftCorner: Point) {
        for (let row = 0; row < shape.height; row++) {
            for (let column = 0; column < shape.width; column++) {
                const internalPoint = new Point(column, row);
                const pointToCheck = bottomLeftCorner.plus(internalPoint);
                const roomAt = this.getRoomContentAt(pointToCheck);
                const shapeAt = shape.getShapeContentAt(internalPoint);
                if (roomAt === "." && shapeAt === ".")
                    continue;
                if (roomAt === "#" && shapeAt === ".")
                    continue;

                this.setRoomContentAt(pointToCheck, "#");
            }
        }

        this.topRockLevel = Math.max(this.topRockLevel, shape.getTopCoordinate(bottomLeftCorner) + 1);
        this.fallenRocks++;
    }

    printRoom() {
        for (let i = this.roomSize.y; i >= 0; i--)
            console.log(this.room[i]);
    }
}