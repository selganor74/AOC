export class Permutator<T> implements Iterable<T[]> {
    private current: T[];
    private nextLevel: Permutator<T>;
    private currentElement!: T;
    private index: number = 0;
    private iterator!: Iterator<T[], any, undefined>;
    private done: boolean = false;

    constructor(
        array: T[],
        private returnOriginal = true
    ) {
        this.current = array.concat();
        this.nextLevel = undefined!;
    }

    getNextIterator() {
        if (this.index < this.current.length) {
            this.currentElement = this.current.shift()!;
            this.nextLevel = new Permutator(this.current, false);
            this.current.push(this.currentElement);
            this.index++;

            this.iterator = this.nextLevel[Symbol.iterator]();
            return true;
        }
        return false;
    }

    [Symbol.iterator](): Iterator<T[], any, undefined> {
        return this.iterate();
    }

    private *iterate(): Generator<T[], void, unknown> {
        while (true) {
            if (this.current.length === 1) {
                yield this.current;
                break;
            }

            if (!this.iterator && !this.getNextIterator()) {
                if (this.returnOriginal) {
                    yield this.current;
                    break;
                }
            }

            let r: IteratorResult<T[], T[]> = this.iterator.next();

            if (r.done) {
                this.nextLevel = undefined!;
                this.iterator = undefined!;
    
                if(this.getNextIterator()) {
                    r = this.iterator.next();    
                }
                else {
                    break;
                }
            }

            yield [this.currentElement].concat(r.value);
        }
    }
}

