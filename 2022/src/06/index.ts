import { signal } from "./input";

function areUnique(input: string) : boolean {
    for(let i = 0; i < input.length - 1; i++) {
        const current = input.charAt(i);
        const truncated = input.slice(i + 1);
        if (truncated.indexOf(current) != -1)
            return false;
    }
    return true;
}

for(let start = 0; start < signal.length - 4; start ++) {
    const end = start + 4;
    const toCheck = signal.slice(start, end);
    if(areUnique(toCheck)) {
        console.log("found start-of-packet marker: " + toCheck + " signal starting at " + end );
        break;
    }
}

for(let start = 0; start < signal.length - 14; start ++) {
    const end = start + 14;
    const toCheck = signal.slice(start, end);
    if(areUnique(toCheck)) {
        console.log("found start-of-message marker: " + toCheck + " signal starting at " + end );
        break;
    }
}