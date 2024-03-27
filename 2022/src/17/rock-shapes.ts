import { Shape } from "./shape";

export const minusShape =
`####`;

export const plusShape =
`.#.
###
.#.`;

export const reversedLShape =
`..#
..#
###`;

export const pipeShape =
`#
#
#
#`;

export const squareShape =
`##
##`;

export const rockShapes = [
    new Shape(minusShape),
    new Shape(plusShape),
    new Shape(reversedLShape),
    new Shape(pipeShape),
    new Shape(squareShape)
];

