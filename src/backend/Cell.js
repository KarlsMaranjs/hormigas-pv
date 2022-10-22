import Canvas from "./Canvas.js";

export default class Cell extends Canvas {
    constructor(i, ii) {
        super();
        this.i = i;
        this.ii = ii;
        this.ant = null;
        this.nest = false;
        this.foodLevel = 0;
        this.signal = 0;
    }

    hasAnt() {
        return !!this.ant;
    }
}