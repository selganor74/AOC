import { NElementsPermutator } from "./n-elements-permutator";
import { Permutator } from "./permutator";

const t1 = new Permutator([1,2,3,4]);
let counter = 0;
for(const a of t1) {
    console.log(JSON.stringify(a));
    counter++;
}
console.log("Permutations: " + counter++);

const t1a = new Permutator([1,2,3,4]);
const iterator = t1a[Symbol.iterator]();
counter = 0;
let result: IteratorResult<number[], any>;
let done = false;
while(!done) {
    result = iterator.next();
    if (!result.done)
        counter++;
    done = result.done!;
};
console.log("steps using iterator: " + counter);


const t2 = new NElementsPermutator([1,2,3,4], 2);
for(const a of t2) {
    console.log(JSON.stringify(a));
}