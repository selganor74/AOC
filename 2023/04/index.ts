// const data =
//     `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
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

type Card = {
    id: number;
    numbers: number[];
}

// PART 2
const cards: Card[] = [];
const extractions: { [cardId: number]: number[] } = [];
for (const row of data) {
    const [cardToSplit, numbersToSplit] = row.split(":");
    const cardId = Number.parseInt(cardToSplit.trim().split(" ").filter(n => n)[1]);
    const [winningNumbersToSplit, cardNumbersToSplit] = numbersToSplit.split("|");
    const winningNumbers = winningNumbersToSplit.trim().split(" ").filter(n => n.trim()).map(n => Number.parseInt(n));
    const cardNumbers = cardNumbersToSplit.trim().split(" ").filter(n => n.trim()).map(n => Number.parseInt(n));

    let matchingNumbers = 0;
    cards[cardId] = {
        id: cardId,
        numbers: cardNumbers
    };
    extractions[cardId] = winningNumbers;

    for (const cn of cardNumbers) {
        if (winningNumbers.find(n => n === cn)) {
            matchingNumbers++;
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


function getNumOfMatchingNumbers(winningNumbers: number[], cardNumbers: number[]) {
    let matchingNumbers = 0;
    for (const cn of cardNumbers) {
        if (winningNumbers.find(n => n === cn)) {
            matchingNumbers++;
        }
    }
    return matchingNumbers;
}

let totalCards = 0;

for (const extractionId in extractions) {
    const currentExtractionId = Number.parseInt(extractionId);
    const extraction = extractions[extractionId];
    let cardsToCheck = [cards[extractionId]];

    console.log("processing extractionId", currentExtractionId)

    let depth = 0;
    do {
        const currentCard = cardsToCheck.pop()!;
        totalCards++;
        let matchingNumbers = getNumOfMatchingNumbers(extraction, currentCard.numbers);
        for (let i = currentCard.id + 1; i < Math.min(data.length, currentCard.id + 1 + matchingNumbers); i++) {
            // console.log("adding card ", i);
            cardsToCheck.push(cards[i]);
            depth++;
        }
    } while (cardsToCheck.length);
}

const result1 = points.filter(n => n).reduce((accu, current) => accu + (current || 0), 0);
console.log("Result 1: ", result1);
console.log("Result 2: ", totalCards);
