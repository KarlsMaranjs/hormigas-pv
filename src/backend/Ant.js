import Insect from "./Insect.js";

export default class Ant extends Insect {
    constructor(i, ii) {
        super()
        this.i = i;
        this.ii = ii;
        this.has_food = false;
        this.last_signal = 0;
        this.orientation = Math.random() * 90;
    }
}