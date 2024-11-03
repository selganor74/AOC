import { data } from "./data";

type CardValues = {
    "2": number,
    "3": number,
    "4": number,
    "5": number,
    "6": number,
    "7": number,
    "8": number,
    "9": number,
    "T": number,
    "J": number,
    "Q": number,
    "K": number,
    "A": number
}

const Cards: CardValues = {
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3,
    "6": 4,
    "7": 5,
    "8": 6,
    "9": 7,
    "T": 8,
    "J": 9,
    "Q": 10,
    "K": 11,
    "A": 12
};

enum PointType {
    HighCard = "0 - High Card",
    OnePair = "1 - One Pair",
    TwoPair = "2 - Two Pair",
    ThreeOfAKind = "3 - Three Of a Kind",
    FullHouse = "4 - Full House",
    FourOfAKind = "5 - Four of a Kind",
    FiveOfAKind = "6 - Five of a Kind"
};

type Hand = string;
type Bid = { hand: Hand, bid: number };
type BidList = Bid[];

type GroupedByPointBidList = { [pointType: string]: BidList }

function buildInput(data: string): BidList {
    const rows = data.split("\n");
    const toReturn: BidList = [];

    for (const rowAsString of rows.filter(r => !!r)) {

        const elements = rowAsString.split(" ");
        if (elements.length !== 2)
            throw new Error("Something went wrong with row: " + rowAsString);

        toReturn.push({ hand: elements[0], bid: Number(elements[1]) });
    }

    return toReturn;
}

function pointExtractor(hand: Hand): PointType {
    const cardsByValue: { [card: string]: number } = {};
    for (const card of hand) {
        cardsByValue[card] = (cardsByValue[card] || 0) + 1;
    }

    let trisCount = 0;
    let pairCount = 0;

    for (const card in cardsByValue) {

        if (cardsByValue[card] === 5)
            return PointType.FiveOfAKind;

        if (cardsByValue[card] === 4)
            return PointType.FourOfAKind;

        if (cardsByValue[card] === 3) {
            trisCount++;
            continue;
        }

        if (cardsByValue[card] === 2) {
            pairCount++;
            continue;
        }
    }
    if (trisCount == 1 && pairCount == 1)
        return PointType.FullHouse;

    if (trisCount == 1 && pairCount == 0)
        return PointType.ThreeOfAKind;

    if (pairCount == 2)
        return PointType.TwoPair;

    if (pairCount == 1)
        return PointType.OnePair;

    return PointType.HighCard;
}

class CardIterator {
    private allKeys: string[] = Object.keys(Cards);
    
    private _current: string | undefined = undefined;
    public get current(): string | undefined {
        return this._current;
    }
    public getNext(): string | undefined { 
        this._current = this.allKeys.shift();
        return this._current;
    }

    public reset() { 
        this.allKeys = Object.keys(Cards) 
        this._current = undefined;
    };
}

class Counter {
    constructor(private ...iterators: CardIterator[]) {
        
        for(const iterator of iterators) {
            iterator.getNext();
        }
        iterators[0].reset();
    }

    getNext(): string[] | undefined {
        let position = 0;
        while(position < this.iterators.length) {
            if(this.iterators[position].getNext())
                break;
            if (position === this.iterators.length -1)
                return undefined;

            this.iterators[position].reset();
            this.iterators[position].getNext();
            position++;
        }

        const toReturn: string[] = [];
        for(const iterator of this.iterators) {
            toReturn.push(iterator.current!);
        }

        return toReturn;
    }
}

function pointExtractorP2(hand: Hand) {
    // The hand does not contain any J
    if (hand.indexOf("J") === -1)
        return pointExtractor(hand);

    const jollies = [];
    let lastJolly = 0;
    while (lastJolly = hand.indexOf("J", lastJolly)) {
        jollies.push(lastJolly);
    }

    const counter = (...iterators: CardIterator[]) {

    }
}

/** returns 1 if first is greater, -1 if second is greater, 0 when equals */
function handComparer(first: Hand, second: Hand): number {
    const firstValue = handToNumber(first);
    const secondValue = handToNumber(second);
    return firstValue > secondValue ? 1 : (secondValue > firstValue ? -1 : 0);
}

function handToNumber(hand: Hand) {
    let position = 4;
    let toReturn = 0;
    for (const card of hand) {
        const positionValue = Math.pow(13, position);
        toReturn += positionValue * (<any>Cards)[card];
        position--;
    }
    return toReturn;
}

function groupByType(handList: BidList): GroupedByPointBidList {
    const toReturn: GroupedByPointBidList = {};

    for (const hand of handList) {
        const point = pointExtractor(hand.hand);
        toReturn[point] = toReturn[point] || [];
        toReturn[point].push(hand);
        toReturn[point].sort((a, b) => handComparer(a.hand, b.hand));
    }

    return toReturn;
}

function getWinningPoints(groupedByType: GroupedByPointBidList): number {
    let rank = 1;
    let winningPoints = 0;
    for (const pointKey of Object.keys(groupedByType).sort()) {
        for (const bid of groupedByType[pointKey]) {
            winningPoints += bid.bid * rank;
            rank++;
        }
    }
    return winningPoints;
}

const handList = buildInput(data);
const groupedByType = groupByType(handList);
const winningPoints = getWinningPoints(groupedByType);

console.log(winningPoints);
