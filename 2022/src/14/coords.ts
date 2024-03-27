export type Coords = { x: number; y: number; };

export function areEqual(p1: Coords, p2: Coords) {
    return p1.x === p2.x && p1.y === p2.y;
}