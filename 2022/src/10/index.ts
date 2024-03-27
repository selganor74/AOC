import { instructions } from "./input";

type InstructionName = "none" | "noop" | "addx"

class Instruction {
    constructor(
        public startedAt: number,
        public length: number,
        public applyEffect: (reg: number) => number
    ) { }

    hasCompleted(currentTick: number) {
        return currentTick - this.startedAt >= this.length;
    }
}


function instructionFactory(currentTick: number, name: InstructionName, parameter?: number): Instruction {
    switch (name) {
        case "none":
            return new Instruction(currentTick, 0, (reg) => reg);
        case "noop":
            return new Instruction(currentTick, 1, (reg) => reg);
        case "addx":
            return new Instruction(currentTick, 2, (reg) => reg + (parameter || 0));
    }
}

function computeSignalStrength() {
    if (isFirst) {
        if (tickCounter == 20) {
            isFirst = false;
            console.log("tickCounter: " + tickCounter + " xreg: " + xreg + " strength: " + (tickCounter * xreg));
            signalStrength += tickCounter * xreg;
        }
    } else {
        if ((tickCounter - 20) % 40 === 0) {
            console.log("tickCounter: " + tickCounter + " xreg: " + xreg + " strength: " + (tickCounter * xreg));
            signalStrength += tickCounter * xreg;
        }
    }
}

const allInstructions = instructions.split("\n");
let ip = -1;
let tickCounter = 0;
let xreg = 1;
let currentInstruction: Instruction = instructionFactory(tickCounter, "none");
let isFirst = true;
let output = "";
let signalStrength = 0;
do {
    computeSignalStrength();
    tickCounter++;
    if (currentInstruction.hasCompleted(tickCounter)) {
        xreg = currentInstruction.applyEffect(xreg);
        ip++;

        if (ip >= allInstructions.length)
            break;

        const tokens = allInstructions[ip].split(" ");
        const instruction = <InstructionName>tokens[0];
        const parameter = Number.parseInt(tokens[1]) || 0;
        currentInstruction = instructionFactory(tickCounter, instruction, parameter);
    };
    drawPixel();
} while (true);

console.log("signal strength: " + signalStrength);
console.log("output: \n" + output);

function drawPixel() {
    const spritePosition = xreg;
    const crtXposition = (tickCounter - 1) % 40;

    let draw = ".";
    if (crtXposition <= spritePosition + 1 && crtXposition >= spritePosition - 1)
        draw = "#";

    output += draw;
    if (tickCounter % 40 === 0)
        output += "\n";
}

