import { rucksacks } from "./input";

function isUpperCase(item: string) {
    return item === item.toUpperCase();
}

function getPriority(item: string) {
    const minLower = "a".charCodeAt(0);
    const minUpper = "A".charCodeAt(0);
    if (isUpperCase(item)) {
        return item.charCodeAt(0) - minUpper + 27;
    } else {
        return item.charCodeAt(0) - minLower + 1;
    }
}

const allRucksacks = rucksacks.split("\n");
let totalPriorities = 0;
let groupPriorities = 0;
let counter = 1;

for (const rs of allRucksacks) {
    const compart1: { [item: string]: number } = {};
    const compart2: { [item: string]: number } = {};

    for (let index = 0; index < rs.length / 2; index++) {
        const itemInCompart1 = rs.charAt(index);
        const itemInCompart2 = rs.charAt(index + rs.length / 2);
        compart1[itemInCompart1] = compart1[itemInCompart1] || 0;
        compart2[itemInCompart2] = compart2[itemInCompart2] || 0;

        compart1[itemInCompart1] += getPriority(itemInCompart1);
        compart2[itemInCompart2] += getPriority(itemInCompart2);
    }

    for (const item in compart1) {
        if (compart2[item]) {
            totalPriorities += getPriority(item);
            break;
        }
    }

    if ((counter % 3) === 0 && counter !== 0) {
        let foundBadge = "";
        const rsMinus1 = allRucksacks[counter - 1 - 1];
        const rsMinus2 = allRucksacks[counter - 2 - 1];
        
        for (let i = 0; i < rs.length; i++) {
            const badge = rs.charAt(i);
            if (    rsMinus1.indexOf(badge) !== -1 
                &&  rsMinus2.indexOf(badge) !== -1
            ) {
                foundBadge = badge;
                console.log("counter: " + counter + " badge: " + foundBadge);
                break;
            }
        }
        
        if (!foundBadge)
            throw new Error("Badge Not Found");
        
        groupPriorities += getPriority(foundBadge);
    }

    counter++;
}

console.log("Total Priorities: " + totalPriorities);
console.log("Badge Priorities: " + groupPriorities);