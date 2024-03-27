import { strategy } from "./input";

const ROCK = 1;    // "A"|"X";
const PAPER = 2;   //  "B"|"Y";
const SCISSOR = 3; //  "C"|"Z";

const LOSE = 0
const DRAW = 3;
const WIN = 6;

const outcomes = {
    "A": {
        toWin: "Y",
        toLose: "Z",
        toDraw: "X"
    },
    "B": {
        toWin: "Z",
        toLose: "X",
        toDraw: "Y"
    },
    "C": {
        toWin: "X",
        toLose: "Y",
        toDraw: "Z"
    }

}

const rules = {
    "A" : {
        "X": DRAW + ROCK,
        "Y": WIN  + PAPER,
        "Z": LOSE + SCISSOR
    },
    "B" : {
        "X": LOSE + ROCK,
        "Y": DRAW + PAPER,
        "Z": WIN  + SCISSOR
    },
    "C" : {
        "X": WIN  + ROCK,
        "Y": LOSE + PAPER,
        "Z": DRAW + SCISSOR
    },
}

function points(othersPlay: "A" | "B" | "C", mePlay: "X" | "Y" | "Z" ) : number {
    if (othersPlay != "A" && othersPlay != "B" && othersPlay != "C")
        throw new Error("others not expected:" + othersPlay);

    if (mePlay != "X" && mePlay != "Y" && mePlay != "Z")
        throw new Error("me not expected:" + mePlay);

        return rules[othersPlay][mePlay];
}

function pointsPart2(othersPlay: "A" | "B" | "C", outcome: "X" | "Y" | "Z" ) : number {
    // X: Lose
    // Y: Draw
    // Z: Win
    let mePlay: "X" | "Y" | "Z";
    switch(outcome) {
        case "X":
            mePlay = <"X" | "Y" | "Z">outcomes[othersPlay].toLose;
            break;
        case "Y":
            // We must draw so we play the same card as the opponent 
            mePlay = <"X" | "Y" | "Z">outcomes[othersPlay].toDraw;
            break;
        case "Z":
                // We must draw so we play the same card as the opponent 
                mePlay = <"X" | "Y" | "Z">outcomes[othersPlay].toWin;
                break;
        default:
            throw new Error("Unexpected outcome")
    }
    return points(othersPlay, mePlay);
}

const strategyEntries = strategy.split("\n");
let allPoints = 0;
let allPointsPart2 = 0;
for(const se of strategyEntries) {
    const plays = se.split(" ");
    const others: "A"|"B"|"C" = <"A"|"B"|"C">plays[0];
    const me: "X"|"Y"|"Z" = <"X"|"Y"|"Z">plays[1];
    allPoints += points(others, me);
    allPointsPart2 += pointsPart2(others, me);
}
console.log("all points: " + allPoints);
console.log("all points part 2: " + allPointsPart2);