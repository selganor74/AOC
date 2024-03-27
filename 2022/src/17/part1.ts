import { Chamber } from "./chamber";
import { jetPattern } from "./input";
import { rockShapes } from "./rock-shapes";

const chamberPart1 = new Chamber(jetPattern, rockShapes, 2022);
chamberPart1.start();

const TotalRocks = 1000000000000;
const chamberPart2 = new Chamber(jetPattern, rockShapes, TotalRocks);
chamberPart2.start();
//console.log("heigth after " + TotalRocks + " fallen " + total);

// 1524873649773 is too Low