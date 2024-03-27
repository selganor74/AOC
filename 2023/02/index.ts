// const data =
// `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.split("\n");

import { data } from "./data";

type Color = "red" | "green" | "blue";
class Extraction {
    constructor(
        public red?: number,
        public green?: number,
        public blue?: number
    ) { }

    contains(other: Extraction) {
        return (this.blue || 0) >= (other.blue || 0)
            && (this.green || 0) >= (other.green || 0)
            && (this.red || 0) >= (other.red || 0)
    }

    get power() { return (this.red || 0) * (this.green || 0) * (this.blue || 0) };
};

// 12 red cubes, 13 green cubes, and 14 blue
const referenceBag = new Extraction(
    /* red:  */ 12,
    /* green:*/ 13,
    /* blue: */ 14
);

const matching: number[] = [];
const powers: number[] = [];

for (const row of data) {
    const gameSplit = row.split(":");
    const game = gameSplit[0];
    const gameId = Number.parseInt(game.trim().split(" ")[1]);
    const extractions = gameSplit[1];

    if (!extractions) continue;

    let plausibles = 0;
    const allExtractions = extractions.split(";");
    const minimalBag = new Extraction(0,0,0);
    for (const extractionSplit of allExtractions) {
        const ballSplit = extractionSplit.split(",");

        const extraction = new Extraction();

        for (const ball of ballSplit) {
            const numberColorSplit = ball.trim().split(" ");
            const color: Color = numberColorSplit[1].trim() as Color;
            const numberOfBalls = Number.parseInt(numberColorSplit[0]);
            extraction[color] = numberOfBalls;

            if(minimalBag[color]! < numberOfBalls) 
                minimalBag[color] = numberOfBalls;
        }

        if (referenceBag.contains(extraction)) {
            plausibles++;
            console.log(`${game}: ${extractionSplit}`, extraction, plausibles);
        } 
    }
    if (plausibles === allExtractions.length)
        matching.push(gameId);

    powers.push(minimalBag.power);
}
const result = matching.reduce((accumulated, current) => accumulated + current, 0);
const result2 = powers.reduce((accumulated, current) => accumulated + current, 0);

console.log("Result: ", result);
console.log("Result 2: ", result2);