export default class Canvas {
    constructor() {
        this._width = 700;
        this._height = 700;
        this.cellSize = 4;
    }

    get getWidth(){
        return this._width
    }

    get getHeight(){
        return this._height
    }
}