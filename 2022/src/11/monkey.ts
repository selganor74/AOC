export class Monkey {
    public monkeyToThrowWhenTrue!: Monkey;
    public monkeyToThrowWhenFalse!: Monkey;

    constructor(
        public items: number[],
        public inspect: (old: number) => number,
        public inspectPart2: (old: number) => number,
        //public modulus: (current: number) => number
        public modBy: number
        ) {}

    modulus(val: number) {
        return val % this.modBy;
    }

    test(val: number) {
        return this.modulus(val) === 0;
    }

    playTurn() {
        const toReturn = this.items.length;
        // console.log(JSON.stringify(this.items));
        // console.log("  B when true:  " + JSON.stringify(this.monkeyToThrowWhenTrue.items));
        // console.log("  B when false: " + JSON.stringify(this.monkeyToThrowWhenFalse.items));
        while(this.items.length) {
            let current = this.items.shift();
            let inspected = this.inspect(current!);
            let bored = Math.floor(inspected / 3);
            if(this.test(bored))
                this.monkeyToThrowWhenTrue.items.push(bored);
            else
                this.monkeyToThrowWhenFalse.items.push(bored);
        }
        // console.log("  A when true:  " + JSON.stringify(this.monkeyToThrowWhenTrue.items));
        // console.log("  A when false: " + JSON.stringify(this.monkeyToThrowWhenFalse.items));
        return toReturn;
    }

    playTurnPart2() {
        const toReturn = this.items.length;
        // console.log(JSON.stringify(this.items));
        // console.log("  B when true:  " + JSON.stringify(this.monkeyToThrowWhenTrue.items));
        // console.log("  B when false: " + JSON.stringify(this.monkeyToThrowWhenFalse.items));
        while(this.items.length) {
            const current = this.items.shift();
            const inspected = this.inspectPart2(current!);
            const bored = inspected; //this.modulus(inspected) || this.modBy; // <-- no more relief, but we can mod the result, but never return 0 !
            if(this.test(bored))
                this.monkeyToThrowWhenTrue.items.push(bored);
            else
                this.monkeyToThrowWhenFalse.items.push(bored);
        }
        // console.log("  A when true:  " + JSON.stringify(this.monkeyToThrowWhenTrue.items));
        // console.log("  A when false: " + JSON.stringify(this.monkeyToThrowWhenFalse.items));
        return toReturn;
    }
}