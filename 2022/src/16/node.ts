export type NodeDict = { [name: string]: Node };

export type Step = {
    moveTo: string | undefined,
    flowRate: number | undefined;
};

export class Node {
    private steps: Step[];
    public origSteps: Step[] = [];

    public accumulatedFlowRate: number = 0;
    constructor(
        public name: string,
        public flowRate: number
    ) {
        this.steps = [];
        if (flowRate !== 0)
            this.steps.push({ moveTo: undefined, flowRate: flowRate });

        this.origSteps = this.steps.map(e => e);
    }

    addDest(nodeName: string) {
        // When adding a destination, we add one at the end of the array 
        // and one at the end of the array, only if ther is a valve to open. 
        this.steps.push({ moveTo: nodeName, flowRate: undefined });
        if (this.flowRate !== 0)
            this.steps.unshift({ moveTo: nodeName, flowRate: undefined });

        this.origSteps = this.steps.map(e => e);
    }

    popNextStep(): Step | undefined {
        // console.log("popping step from: " + this.name + " remaining: " + this.steps.length);
        return this.steps.pop();
    }

    getTotalSteps(): number {
        return this.origSteps.length;
    }

    deepClone(): Node {
        const toReturn = new Node(this.name, this.flowRate);

        toReturn.accumulatedFlowRate = this.accumulatedFlowRate;
        toReturn.origSteps = this.origSteps;
        toReturn.steps = this.origSteps.map(e => { return { moveTo: e.moveTo, flowRate: e.flowRate }; });

        return toReturn;
    }
}