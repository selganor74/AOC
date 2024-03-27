export type Move = { itemsToMove: number, from: number, to: number };
export function parseMove(move: string) : Move {
    const tokens = move.split(" ");
    const toReturn: Move = <any>{};
    
    toReturn.itemsToMove = Number.parseInt(tokens[1]);
    toReturn.from = Number.parseInt(tokens[3]);
    toReturn.to = Number.parseInt(tokens[5]);
    
    return toReturn;
}