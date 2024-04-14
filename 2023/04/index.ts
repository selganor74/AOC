// const data =
// `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`.split("\n");

import { data } from "./data";

const points: number[] = [];

for (const row of data) {
    const [cardToSplit, numbersToSplit] = row.split(":");
    const cardId = Number.parseInt(cardToSplit.trim().split(" ").filter(n => n)[1]);
    const [winningNumbersToSplit, cardNumbersToSplit] = numbersToSplit.split("|");
    const winningNumbers = winningNumbersToSplit.trim().split(" ").filter(n => n.trim()).map(n => Number.parseInt(n));
    const cardNumbers = cardNumbersToSplit.trim().split(" ").filter(n => n.trim()).map(n => Number.parseInt(n));
    const wins: number[] = [];
    for (const cn of cardNumbers) {
        if (winningNumbers.find(n => n === cn)) {
            wins.push(cn);
            points[cardId] = points[cardId] || 0;
            points[cardId] = points[cardId] + 1
        }
    }
    if (points[cardId])
        points[cardId] = Math.pow(2, points[cardId] - 1);
    else
        points[cardId] = 0;

    // console.log(row, cardId, wins, points[cardId]);
}

const result1 = points.filter(n => n).reduce((accu, current) => accu + (current || 0), 0);
console.log("Result 1: ", result1);


// PART 2
const cards: number[] = [];

let cardId = 0;
for (const row of data) {
    const [cardToSplit, numbersToSplit] = row.split(":");
    // const cardId = Number.parseInt(cardToSplit.trim().split(" ").filter(n => n)[1]);
    const [winningNumbersToSplit, cardNumbersToSplit] = numbersToSplit.split("|");
    const winningNumbers = winningNumbersToSplit.trim().split(" ").filter(n => n.trim()).map(n => Number.parseInt(n));
    const cardNumbers = cardNumbersToSplit.trim().split(" ").filter(n => n.trim()).map(n => Number.parseInt(n));
    let wins = 0;
    for (const cn of cardNumbers) {
        if (winningNumbers.find(n => n === cn)) {
            wins++;
        }
    }
    let idx = 1;
    cards[cardId] = cards[cardId] || 1;
    const numberOfCards = cards[cardId];
    // console.log ("CardId: " + cardId + " ( x " + numberOfCards + " ) Wins: " + wins + " [ " + cards.join(", ") + " ]");
    while (idx <= wins && cardId + idx < data.length) {
        const wonCardId = cardId + idx;
        cards[wonCardId] = cards[wonCardId] || 1;
        cards[wonCardId] += numberOfCards;
        idx++;
    }
    cardId++;
    // console.log(row, cardId, wins, points[cardId]);
}
const result2 = cards.reduce((p, c) => p + c, 0);
console.log("Result 2: ", result2);
