import Insect from "./Insect.js";

export default class Ant extends Insect {
    constructor(i, ii) {
        super()
        this.i = i;
        this.ii = ii;
        this.has_food = false;
        this.last_signal = 0;
        this.orientation = Math.random() * 90;
        this.width = 4
        this.height = 4
    }

    getCoordsFromOrientation() {
        let coords = [];
        let orientation_radians = Math.to_radians(this.orientation);
        coords.push(this.getBoundedIndex(Math.round(this.i + Math.cos(orientation_radians))));
        coords.push(this.getBoundedIndex(Math.round(this.ii + Math.sin(orientation_radians))));
        return coords;
    }
}