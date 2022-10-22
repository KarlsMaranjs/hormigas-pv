import Canvas from "./Canvas.js";

export default class Nest extends Canvas {
    constructor() {
        super();
        this.i = 0;
        this.ii = 0;
        this.width = 70;
        this.height = 70;
        this.x = (super.getWidth / 2) - (this.width / 2);
        this.y = (super.getHeight / 2) - (this.height / 2);
        this.color = "red";
    }

    draw() {
        cellSize = this.cellSize
        x = this.x
        y = this.y

        for (let i = 0; i < cols; i++) {
            for (let ii = 0; ii < rows; ii++) {
                //Ubicar el hormiguero
                if (i * cellSize >= x && (i * cellSize) <= (x + nest.width) && (ii * cellSize) >= y && (ii * cellSize) <= (y + nest.height)) {
                    ctx.beginPath();
                    ctx.strokeStyle = "black";
                    ctx.strokeRect(i * cellSize, ii * cellSize, cellSize, cellSize);
                    ctx.closePath();
                }
            }
        }
    }

    style() {

    }

}