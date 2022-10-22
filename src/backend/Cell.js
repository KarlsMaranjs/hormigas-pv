import Canvas from "./Canvas.js";

export default class Cell extends Canvas {
    constructor(i, ii) {
        super();
        this._i = i;
        this._ii = ii;
        this.ant = null;
        this.nest = false;
        this.foodLevel = 0;
        this.signal = 0;
    }
    
    get i(){
        return this._i
    }

    get ii(){
        return this._ii
    }
    
    set i(i){
        this._i = i
    }

    set ii(ii){
        this._ii = ii
    }
    
    hasAnt() {
        return !!this.ant;
    }

    getBoundedIndex(index) {
        let cols = this.cols;
        let bounded_index = index;

        if (index < 0) {
            bounded_index = 0;
        }
        if (index >= cols) {
            bounded_index = cols-1;
        }
        return bounded_index;
    }

    getRandomCoordinates(i, ii) {
        let j   = this.getRandomInt(i-1, i+1);
        let jj  = this.getRandomInt(ii-1, ii+1);
        j  = this.getBoundedIndex(j);
        jj = this.getBoundedIndex(jj);
        return [j, jj];
    }

    getRandomInt(min, max) {
        return Math.floor((Math.random() * (max - min + 1))) + min;
    }

    calcDistance(i, ii, j, jj) {
        return Math.pow(Math.pow(Math.abs(i - j), 2) + Math.pow(Math.abs(ii - jj), 2), 0.5);
    }
}