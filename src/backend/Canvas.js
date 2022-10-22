export default class Canvas {
    #canvas;
    constructor(htmlCanvasElement) {
        this._width = 700;
        this._height = 700;
        this.cellSize = 4;
        this.#canvas = htmlCanvasElement;
    }

    get getWidth(){
        return this._width;
    }

    get getHeight(){
        return this._height;
    }
    
    get cols(){
        return this._width/this.cellSize;
    }
    
    get rows(){
        return this._height/this.cellSize;
    }
    
    get context(){
        return this.#canvas.getContext("2d");
    }
}