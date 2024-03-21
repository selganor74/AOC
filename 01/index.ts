// const data = [
//     "1abc2",
//     "pqr3stu8vwx",
//     "a1b2c3d4e5f",
//     "treb7uchet"
// ];

import { data } from "./data";

let total = 0;
for (const row of data) {
    let first: string | null = null;
    let last: string | null = null;
    const matches = (row.match(/([0-9]{1})/g) || []);
    for (const number of matches) {
        if (!first) first = number;
        last = number;
    }
    total += Number.parseInt(`${first}${last}`);
    // console.log(`${row} ${first} ${last} --> ${first}${last}`);
}
console.log(`part 1 answer is ${total}`);

const textToNumberString: { [id: string]: string } = {
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
}
total = 0;
const regex = /(one|two|three|four|five|six|seven|eight|nine|[0-9]{1})/g;
for (const row of data) {
    let first: string | null = null;
    let last: string | null = null;
    // const matches = (row.match(/(one|two|three|four|five|six|seven|eight|nine|[0-9]{1})/g) || []);
    const matches: string[] = [];
    let numberOrString;

    // a simple regex match is not enough, because of strings like this:
    // 5tg578fldlcxponefourtwonet ... the last number must be a "one", 
    // but string.match(regex) would return "two" as last number
    while (numberOrString = regex.exec(row)) {
        matches.push(numberOrString[0]);
        regex.lastIndex = numberOrString.index + 1;
    }
    for (const number of matches) {
        if (!first) first = textToNumberString[number];
        last = textToNumberString[number];
    }
    total += Number.parseInt(`${first}${last}`);
    // console.log(`${row} ${first} ${last} --> ${first}${last}`);
}

console.log(`part 2 answer is ${total}`);
