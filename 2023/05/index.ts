import { data } from "./data";

function findDestination(source: number, mapping: number[][]) {
    for (const range of mapping) {
        const [destinationStart, sourceStart, rangeLen] = range;
        if (source >= sourceStart && source < sourceStart + rangeLen) {
            return destinationStart + (source - sourceStart);
        }
    }
    return source;
}

function findLocation(seed: number) {
    const mappingSequence = [
        data.seed_to_soil_map,
        data.soil_to_fertilizer_map,
        data.fertilizer_to_water_map,
        data.water_to_light_map,
        data.light_to_temperature_map,
        data.temperature_to_humidity_map,
        data.humidity_to_location_map
    ];
    let destination = 0;
    let source = seed;
    for(const mapping of mappingSequence) {
        destination = findDestination(source, mapping);
        source = destination;
    }
    // last destination is the location (the latest mapping)
    return destination;
}

// const locations: {[seed: string]: number} = {};
let lowestLocation = Number.MAX_SAFE_INTEGER;
for (const seed of data.seeds) {
    const location = findLocation(seed);
    lowestLocation = Math.min(lowestLocation, location);
}

console.log("Result 1: ", lowestLocation);