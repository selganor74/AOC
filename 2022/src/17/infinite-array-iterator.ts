export type Iteration<T> = {
    position: number,
    current: T
}

export class InfiniteArrayIterator<T> implements Iterable<Iteration<T>> {

    private currentIndex = 0;

    constructor(
        private toIterate: T[]
    ) {}

    private * iterate(): Generator<Iteration<T>, Iteration<T>, unknown> {
        while(true) {
            yield {
                current: this.toIterate[this.currentIndex],
                position: this.currentIndex
            };
 
            this.currentIndex++;
 
            if(this.currentIndex >= this.toIterate.length)
                this.currentIndex = 0;
        }
    }

    [Symbol.iterator](): Generator<Iteration<T>, Iteration<T>, unknown> {
        return this.iterate();
    }
}