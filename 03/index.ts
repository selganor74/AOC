// const data =
//     `
// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..`.split("\n");

import { data } from "./data";
data.splice(0, 1);

type SerialPosition = {
    isSerial?: boolean;
    row: number;
    start?: number;
    end?: number;
    serial?: number;
    symbol?: string;
    originalData?: string;
    serials?: number[];
}

function checkIfIsSerialAgainstSymbolsInRow(y: number, mayBeSerial: SerialPosition) {
    const symbolsInRow = symbolPositions[y];
    if (!symbolsInRow) return;

    for (const symbol of symbolsInRow) {
        // console.log(symbol, mayBeSerial);
        if ((symbol.start! >= mayBeSerial.start! - 1) && (symbol.end! <= mayBeSerial.end! + 1)) {
            // console.log("setting isSerial to true");
            mayBeSerial.isSerial = true;
            if (symbol.symbol === "*") {
                symbol.serials = symbol.serials || [];
                symbol.serials.push(mayBeSerial.serial!);
            }
        }
    }
}

function extractSymbolPosition(m3: RegExpMatchArray, y: number) {
    let start = 0;
    let end = 0;
    // console.log(m3);
    for (const match of m3) {
        if (match) {
            end = start + match.length - 1;
            symbolPositions[y].push({
                row: y,
                start: start,
                end: end,
                symbol: match,
                originalData: data[y]
            });
            start += match.length - 1;
        }
        start++;
    }
}

function extractSerialPositions(m2: RegExpMatchArray, y: number) {
    // data[y] = '..592.....'
    // m2 =    [ '', '', '592', '', '', '', '', '', '']
    //         | .   .    592   .   .   .   .   . | 
    let start = 0;
    let end = 0;
    for (const match of m2) {
        if (match) {
            end = start + match.length - 1;
            serialRanges[y].push({
                row: y,
                start: start,
                end: end,
                serial: Number.parseInt(match),
                originalData: data[y]
            });
            start += match.length - 1;
        }
        start++;
    }
}

const serialRanges: { [id: number]: SerialPosition[] } = [];
const symbolPositions: { [id: number]: SerialPosition[] } = [];

for (let y = 0; y < data.length; y++) {
    serialRanges[y] = [];
    symbolPositions[y] = [];

    const m2 = data[y].match(/(\d+)*/g);
    if (m2) {
        extractSerialPositions(m2, y);
    }

    const m3 = data[y].match(/([^\d^\.]+)*/g);
    if (m3) {
        extractSymbolPosition(m3, y);
    }
}

for (let y = 0; y < data.length; y++) {
    const serialsInRow = serialRanges[y];
    for (const mayBeSerial of serialsInRow) {
        // check previous row
        if ((y - 1) > 0) {
            checkIfIsSerialAgainstSymbolsInRow(y - 1, mayBeSerial);
        }

        // check current row
        checkIfIsSerialAgainstSymbolsInRow(y, mayBeSerial);

        // check next row
        if ((y + 1) < data.length) {
            checkIfIsSerialAgainstSymbolsInRow(y + 1, mayBeSerial);
        }
    }
}

const trueSerials: SerialPosition[] = [];
for (const row in serialRanges) {
    trueSerials.push(...serialRanges[row]?.filter(mbs => mbs.isSerial && mbs.serial));
}

const gears: SerialPosition[] = [];
for (const row in symbolPositions) {
    const symbolsInRow = symbolPositions[row];
    gears.push(...symbolsInRow.filter(s => s.serials?.length === 2));
}

const result1 = trueSerials.map(msb => msb.serial!).reduce((accumulated, current) => accumulated + current, 0);
const result2 = gears.map(s => s.serials![0] * s.serials![1]).reduce((accumulated, current) => accumulated + current, 0);
// console.log(serialRanges, symbolPositions);
// console.log(trueSerials);
console.log("Result 1: ", result1);
console.log("Result 2: ", result2);
