import { Monkey } from "./monkey";

// This supermodulo is made up of all factors that are userd by monkeys
// to test for divisibility against the "worry level".
// Any number "modded" by this value will preserve divisibility tests for
// all of the factors included.
const superModulo = 2 * 3 * 5 * 7 * 11 * 13 * 17 * 19;

/*
Monkey 0:
Starting items: 63, 57
Operation: new = old * 11
Test: divisible by 7
If true: throw to monkey 6
If false: throw to monkey 2
*/
const monkey0 = new Monkey(
    [63, 57],
    (old) => old * 11,
    (old) => old * 11,
    //(toTest) => (toTest % 7)
    7
);

/*
Monkey 1:
Starting items: 82, 66, 87, 78, 77, 92, 83
Operation: new = old + 1
Test: divisible by 11
If true: throw to monkey 5
If false: throw to monkey 0
*/
const monkey1 = new Monkey(
    [82, 66, 87, 78, 77, 92, 83],
    (old) => old + 1,
    (old) => old + 1,
    //(toTest) => (toTest % 11)
    11
);

/*
Monkey 2:
Starting items: 97, 53, 53, 85, 58, 54
Operation: new = old * 7
Test: divisible by 13
If true: throw to monkey 4
If false: throw to monkey 3
*/
const monkey2 = new Monkey(
    [97, 53, 53, 85, 58, 54],
    (old) => old * 7,
    (old) => (old % superModulo) * 7 || superModulo,
    //(toTest) => (toTest % 13)
    13
);

/*
Monkey 3:
Starting items: 50
Operation: new = old + 3
Test: divisible by 3
If true: throw to monkey 1
If false: throw to monkey 7
*/
const monkey3 = new Monkey(
    [50],
    (old) => old + 3,
    (old) => old + 3,
    //(toTest) => (toTest % 3)
    3
);

/*
Monkey 4:
Starting items: 64, 69, 52, 65, 73
Operation: new = old + 6
Test: divisible by 17
If true: throw to monkey 3
If false: throw to monkey 7
*/
const monkey4 = new Monkey(
    [64, 69, 52, 65, 73],
    (old) => old + 6,
    (old) => old + 6,
    //(toTest) => (toTest % 17)
    17
);

/*
Monkey 5:
Starting items: 57, 91, 65
Operation: new = old + 5
Test: divisible by 2
If true: throw to monkey 0
If false: throw to monkey 6
*/
const monkey5 = new Monkey(
    [57, 91, 65],
    (old) => old + 5,
    (old) => old + 5,
    //(toTest) => (toTest % 2)
    2
);

/*
Monkey 6:
Starting items: 67, 91, 84, 78, 60, 69, 99, 83
Operation: new = old * old
Test: divisible by 5
If true: throw to monkey 2
If false: throw to monkey 4
*/
const monkey6 = new Monkey(
    [67, 91, 84, 78, 60, 69, 99, 83],
    (old) => old * old,
    (old) => (old % superModulo) * (old % superModulo) || superModulo,
    //(toTest) => (toTest % 5)
    5
);

/*
Monkey 7:
Starting items: 58, 78, 69, 65
Operation: new = old + 7
Test: divisible by 19
If true: throw to monkey 5
If false: throw to monkey 1
*/
const monkey7 = new Monkey(
    [58, 78, 69, 65],
    (old) => old + 7,
    (old) => old + 7,
    //(toTest) => (toTest % 19)
    19
);

monkey7.monkeyToThrowWhenTrue = monkey5;
monkey7.monkeyToThrowWhenFalse = monkey1;
monkey6.monkeyToThrowWhenTrue = monkey2;
monkey6.monkeyToThrowWhenFalse = monkey4;
monkey5.monkeyToThrowWhenTrue = monkey0;
monkey5.monkeyToThrowWhenFalse = monkey6;
monkey4.monkeyToThrowWhenTrue = monkey3;
monkey4.monkeyToThrowWhenFalse = monkey7;
monkey3.monkeyToThrowWhenTrue = monkey1;
monkey3.monkeyToThrowWhenFalse = monkey7;
monkey2.monkeyToThrowWhenTrue = monkey4;
monkey2.monkeyToThrowWhenFalse = monkey3;
monkey1.monkeyToThrowWhenTrue = monkey5;
monkey1.monkeyToThrowWhenFalse = monkey0;
monkey0.monkeyToThrowWhenTrue = monkey6;
monkey0.monkeyToThrowWhenFalse = monkey2;

export const allMonkeys: Monkey[] = [
    monkey0,
    monkey1,
    monkey2,
    monkey3,
    monkey4,
    monkey5,
    monkey6,
    monkey7
];