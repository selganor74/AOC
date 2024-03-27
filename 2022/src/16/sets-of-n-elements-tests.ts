import { SetsOfNElements } from "./sets-of-n-elements";

const sets = new SetsOfNElements([1,2,3,4,5], 3);
for(const set of sets)
    console.log(set);