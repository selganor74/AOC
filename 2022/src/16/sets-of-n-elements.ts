export class SetsOfNElements<T> implements Iterable<T[]> {

    iterator!: Iterator<T[], any, undefined>;
    nextValue!: IteratorResult<T[], any>;
    private allSets: T[][] = [];

    constructor(
        array: T[],
        private numberOfElements: number
    ) {
        if (!numberOfElements)
            numberOfElements = array.length;

        if (numberOfElements > array.length)
            throw new Error("numberOfElements cannot be greater than array length (" + this.numberOfElements + " > " + array.length + " )");

        for (let i = 0; i < Math.pow(2, array.length) - 1; i++) {
            if (this.bitCount(i) === numberOfElements) {
                const combination: T[] = [];
                let toTake = i.toString(2).trim().padStart(array.length, "0");
                // console.log(this.bitCount(i) + " " + i.toString(2) + " " + toTake + " array.length: " + array.length);
                for (let idx = 0; idx < toTake.length; idx++) {
                    if (toTake.charAt(idx) === "0")
                        continue;

                    combination.push(array[idx]);
                }

                this.allSets.push(combination);
            }
        }
    }

    private bitCount(n: number) {
        n = n - ((n >> 1) & 0x55555555);
        n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
        return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
    }

    [Symbol.iterator](): Iterator<T[], any, undefined> {
        return this.iterate();
    }

    private *iterate() {
        for(const set of this.allSets)
            yield set;
    }
}
