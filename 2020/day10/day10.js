const input = [
    54,
    91,
    137,
    156,
    31,
    70,
    143,
    51,
    50,
    18,
    1,
    149,
    129,
    151,
    95,
    148,
    41,
    144,
    7,
    125,
    155,
    14,
    114,
    108,
    57,
    118,
    147,
    24,
    25,
    73,
    26,
    8,
    115,
    44,
    12,
    47,
    106,
    120,
    132,
    121,
    35,
    105,
    60,
    9,
    6,
    65,
    111,
    133,
    38,
    138,
    101,
    126,
    39,
    78,
    92,
    53,
    119,
    136,
    154,
    140,
    52,
    15,
    90,
    30,
    40,
    64,
    67,
    139,
    76,
    32,
    98,
    113,
    80,
    13,
    104,
    86,
    27,
    61,
    157,
    79,
    122,
    59,
    150,
    89,
    158,
    107,
    77,
    112,
    5,
    83,
    58,
    21,
    2,
    66
];

const buildSorted = () => {
    const plugJolts = 0;
    let sorted = input.map(t => t).sort((a,b) => a - b);
    sorted.unshift(plugJolts);

    const myJolts = sorted[sorted.length - 1] + 3;
    sorted.push(myJolts);
    return sorted;
}


const part1 = () => {
    const sorted = buildSorted();
    let joltDeltas = [];
    for(let i = 1; i < sorted.length; i++) {
        let delta = sorted[i] - sorted[i - 1];
        if (delta > 3) throw new Error(`Unexpected delta of ${delta} at index ${i} ( ${sorted[i]} - ${sorted[i-1]} )`);
        joltDeltas[delta] = ( joltDeltas[delta] || 0 ) + 1; 
    }
    let response = joltDeltas[1] * joltDeltas[3]; 
    console.log(`... and the answer to part 1 is ${response}`, joltDeltas);
}

const possiblePathsFrom = (sorted = [], index = 0, accumulator = 0) => {
    const currJolts = sorted[index];

    if (index == sorted.length) // the last adapter before my device
        return ++accumulator;

    let canMoveOn = false;
    let next = 1;
    while( sorted[index + next]  - currJolts <= 3 ) {
        accumulator += possiblePathsFrom( sorted, index + next, accumulator );
        canMoveOn = true;
        next++;
    }
    if(canMoveOn)
        console.log(`canMoveOn: ${canMoveOn} - accumulator: ${accumulator}`);
    else
        console.log(`death path found at index[${index}] `); // should really never happen.
    return canMoveOn ? accumulator : 0;
}

const factorial = (n = 1) => {
    if( n == 0) return 1;
    if (n == 1) return 1;
    return n * factorial(n - 1);
}

const Group = (startValue) => {
    start = startValue;
    end = -1;
    arraySlice = [];
    return {
        setStart: (value) => start = value,
        setEnd: (value, array) => {end = value; arraySlice = array.slice(start, end-start+1); }, 
        length: () => end - start + 1,
        getStart: () => start,
        getEnd: () => end,
        getPermutations: () => {
            switch(end - start + 1) {
                case 1: return 1;
                case 2: return 1;
                case 3: return 2;
                case 4: return 4;
                case 5: return possiblePathsFrom(arraySlice, 0);
                default:
                    throw new Error(`Unexpected lenght of ${end - start + 1}`)
            }
        }
    }
}

const findGroupsBetweenIntervalsOf3 = (sorted = []) => {
    let group = Group();
    let toReturn =  [];
    let maxGroupLen = 0;
    for(let i = 0; i < sorted.length - 1; i++) {
        if ( i == 0 || sorted[i] - sorted[i - 1] == 3)
            group = Group(i);
        
        if ( i == sorted.length -1 || sorted[ i + 1 ] - sorted[i] == 3) {
            group.setEnd(i, sorted);
            toReturn.push(group);
            maxGroupLen = group.length() > maxGroupLen ? group.length() : maxGroupLen;
        }
        
    }
    console.log(`found ${toReturn.length} with 3 jolts boundary, with a max length of ${maxGroupLen}`);
    return toReturn;
}

const part2 = () => {
    // how many distinct arrangements of the adapters can exist =
    const sorted = buildSorted();
    // const totalPaths = possiblePathsFrom(sorted, 0, 0);
    var groups = findGroupsBetweenIntervalsOf3(sorted);
    let totalPaths = 1;
    groups.forEach(g => totalPaths = totalPaths * g.getPermutations());
    console.log(`... and the answer to part 2 is ${totalPaths} possible arrangements for my adapters.`, groups);
}

part1(); // 2046
part2();