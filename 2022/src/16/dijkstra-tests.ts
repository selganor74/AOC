import { buildNodes } from "./buildNodes";
import { preCalculateDijkstra } from "./dijkstra";
import { findPathValue } from "./findPathValue";
import { getAllNodesWithValves } from "./getAllNodesWithValves";
import { bestPathFlowRate, startNodeName, valveMap } from "./test_input";

const allNodes = buildNodes(valveMap);
const allNodesWithValves = getAllNodesWithValves(allNodes);

const dij30 = preCalculateDijkstra(allNodes, allNodesWithValves.map(n => n.name), startNodeName, 30);
const dij26 = preCalculateDijkstra(allNodes, allNodesWithValves.map(n => n.name), startNodeName, 26);

const tests = [
    () => {
        if (dij30[0]["AA"].distances["DD"] !== 1)
            throw new Error("Distances should not contain time to open the valve");
    },
    () => {
        const flowRateIfMovingToDD = dij30[0]["AA"].flowRates["DD"];
        const expectedToBe = 20 * 28;
        if (flowRateIfMovingToDD !== expectedToBe)
            throw new Error("If moving to DD we should obtain a flowRate of 28 remaining steps by 20 flow rate = " + expectedToBe + " but was " + flowRateIfMovingToDD);
    },
    () => {
        const flowRateIfMovingFromDDToEE = dij30[2]["DD"].flowRates["EE"];
        const expectedToBe = 3 * 26;
        if (flowRateIfMovingFromDDToEE != expectedToBe)
            throw new Error("If moving from DD to EE at step 2, we expect 26 steps by 3 flow rate = " + expectedToBe + " but was " + flowRateIfMovingFromDDToEE);
    },
    () => {
        const expectedSteps = 0 /*initial*/ + 2 /* move to DD and open valve */ + 2 /* move to EE and open valve */
        const expectedFlow = 0 + (20 * 28) + (3 * 26);
        const pathValueFromAAtoEE = findPathValue(30, dij30, "AA", ["DD", "EE"], 0);
        if (pathValueFromAAtoEE.accumulatedFlowRate != expectedFlow)
            throw new Error("We expect accumulatedFlowRate to be " + expectedFlow + " but was " + pathValueFromAAtoEE.accumulatedFlowRate);

        if (pathValueFromAAtoEE.spentSteps != expectedSteps)
            throw new Error("We expect spentSteps to be " + expectedSteps + " but was " + pathValueFromAAtoEE.spentSteps);
    },
    () => {
        const expectedFlow = bestPathFlowRate;
        const pathValue = findPathValue(30, dij30, "AA", ["DD", "BB", "JJ", "HH", "EE", "CC"], 0);
        if (pathValue.accumulatedFlowRate !== expectedFlow)
            throw new Error("Solution not matching the example given by AOC. Expected " + expectedFlow + " but was " + pathValue.accumulatedFlowRate);
    },
    () => {
        const startStep = 0;
        const flowRateIfMovingToJJ = dij26[startStep]["AA"].flowRates["JJ"];
        const distance = dij26[startStep]["AA"].distances["JJ"];
        const nodeFlowRate = allNodes["JJ"].flowRate;
        const expectedFlow = nodeFlowRate * (26 - startStep - (distance + 1));
        console.log("expectedFlow: " + expectedFlow + " flowRate: " + nodeFlowRate + " distance: " + distance);
        if (flowRateIfMovingToJJ !== expectedFlow)
            throw new Error("If moving to JJ we should obtain a flowRate of 23 remaining steps by 21 flow rate = " + expectedFlow + " but was " + flowRateIfMovingToJJ);
    },
    () => {
        const startStep = 5;
        const flowRateIfMovingToDDfromJJ = dij26[startStep]["JJ"].flowRates["DD"];
        
        const distance = dij26[startStep]["JJ"].distances["DD"];
        const nodeFlowRate = allNodes["DD"].flowRate;
        const remainingSteps = (26 - startStep - (distance + 1));
        const expectedFlow = nodeFlowRate * remainingSteps;
        if (flowRateIfMovingToDDfromJJ !== expectedFlow)
            throw new Error("If moving to DD from JJ @ step " + startStep + " we should obtain a flowRate of " + remainingSteps + " remaining steps by " + nodeFlowRate + " flow rate = " + expectedFlow + " but was " + flowRateIfMovingToDDfromJJ);
    }

];

for (const test of tests) {
    test();
}


