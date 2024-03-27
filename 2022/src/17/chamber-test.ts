import { Chamber } from "./chamber";
import { jetPattern } from "./input-test";
import { rockShapes } from "./rock-shapes";

const chamber = new Chamber(jetPattern, rockShapes);
chamber.start();

const TotalRocks = 1000000000000;
const mcd = rockShapes.length * jetPattern.length;
const repeatableChamber = new Chamber(jetPattern, rockShapes, mcd - 1);
const repeatableHeight = repeatableChamber.start();
repeatableChamber.printRoom();

const integerPart = repeatableHeight * (TotalRocks / mcd);  
const remainingChamber = new  Chamber(jetPattern, rockShapes, TotalRocks - integerPart)
console.log(repeatableHeight);