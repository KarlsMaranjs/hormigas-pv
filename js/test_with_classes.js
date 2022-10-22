import Nest from "../src/backend/Nest.js";
import Cell from "../src/backend/Cell.js";
import Ant from "../src/backend/Ant.js";
import Canvas from "../src/backend/Canvas.js";

let classCanvas = new Canvas(document.getElementById("ground"))

//Select canvas
var canvas = new Canvas(document.getElementById("ground"));
var ctx = canvas.context;

//Config
var cellSize = classCanvas.cellSize;
let canvas_width = classCanvas._width;
let canvas_height = classCanvas._height;

let cols = canvas_width / cellSize;
let rows = canvas_height / cellSize;
// var rows = 200;
var grid = [];
var max_ants_on_grid = 200;
var ants_on_grid = 100;
var ants_out_of_nest = 0;
var gathered_food = 0;
var delivered_food = 0;
var hive = [];
var signalFade = 0.004;
var nest = new Nest();
Math.to_radians = function (degrees) {
    return degrees * Math.PI / 180;
};

function createGrid() {
    for (var i = 0; i < cols; i++) {
        grid[i] = [];
        for (var ii = 0; ii < rows; ii++) {
            //Ubicar el hormiguero (Nest)
            grid[i][ii] = new Cell(i, ii);
            var celda = grid[i][ii];
            if (i * cellSize >= nest.x && (i * cellSize) <= nest.x + nest.width && ii * cellSize >= nest.y && (ii * cellSize) <= nest.y + nest.height) {
                celda.nest = true;
                nest.i = i;
                nest.ii = ii;
            }
        }
    }
}

function drawNest() {
    for (var i = 0; i < cols; i++) {
        for (var ii = 0; ii < rows; ii++) {
            //Ubicar el hormiguero
            if (i * cellSize >= nest.x && (i * cellSize) <= nest.x + nest.width && ii * cellSize >= nest.y && (ii * cellSize) <= nest.y + nest.height) {
                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.strokeRect(i * cellSize, ii * cellSize, cellSize, cellSize);
                ctx.closePath();
            }

        }
    }
}

function drawCells() {
    for (var i = 0; i < cols; i++) {
        for (var ii = 0; ii < rows; ii++) {
            var ant = grid[i][ii].ant;

            if (grid[i][ii].foodLevel === 1) {
                ctx.fillStyle = "rgba(0, 225, 150, 0.5)";
                ctx.fillRect(i * cellSize, ii * cellSize, cellSize, cellSize);
            } else if (grid[i][ii].foodLevel > 1) {
                ctx.fillStyle = "rgb(0, 225, 0)";
                ctx.fillRect(i * cellSize, ii * cellSize, cellSize, cellSize);
            }
            if (ant) {
                if (ant.has_food) {
                    ctx.fillStyle = "rgb(0, 225, 0)";
                    grid[i][ii].signal = ant.last_signal;
                } else {
                    ctx.fillStyle = "black";
                }
                ctx.fillRect(i * cellSize, ii * cellSize, ant.width, ant.height);
            }
            // Hacer que la señal se propage hasta las casillas adyacentes.
            if (grid[i][ii].signal > 0 && !ant) {
                for (var s = i - 1; s <= i + 1; s++) {
                    for (var ss = ii; ss <= ii + 1; ss++) {
                        var s = get_bounded_index(s);
                        var ss = get_bounded_index(ss);
                        var signal = grid[i][ii].signal * 0.7;


                        if (s !== i || ss !== ii) {
                            signal = signal * 0.3;
                        }
                        if (grid[s][ss].signal === 0 || grid[s][ss].signal === false) {
                            grid[s][ss].signal = signal;
                        }
                        if (grid[s][ss].signal > 0.1) {
                            ctx.fillStyle = "rgba(255, 120, 0, " + signal / 2 + ")";
                            ctx.fillRect(s * cellSize, ss * cellSize, cellSize, cellSize);
                            grid[s][ss].signal -= signalFade;
                        }
                        if (grid[s][ss].signal <= 0.1) {
                            grid[s][ss].signal = 0;
                        }
                    }
                }

            }

        }
    }
}


function get_random_int(min, max) {
    return Math.floor((Math.random() * (max - min + 1))) + min;
}

//Para que las hormigas no escapen
function get_bounded_index(index) {
    let bounded_index = index;
    if (index < 0) {
        bounded_index = 0;
    }
    if (index >= cols) {
        bounded_index = cols - 1;
    }
    return bounded_index;
}

function move_ant_out_of_nest() {
    let offset = 3;
    let i = nest.i - offset;
    let ii = nest.ii + offset;
    let new_coords = get_random_coordinates(i, ii);
    let j = new_coords[0];
    let jj = new_coords[1];
    if (!grid[j][jj].hasAnt() && ants_out_of_nest < ants_on_grid) {
        grid[j][jj].ant = new Ant(j, jj);
        hive.push(grid[j][jj].ant);
        // console.log(grid[j][jj].ant)
        ants_out_of_nest++;
        $('#display-total-ants').html(ants_out_of_nest);
    }
}

function get_random_coordinates(i, ii) {
    var j = get_random_int(i - 1, i + 1);
    var jj = get_random_int(ii - 1, ii + 1);
    j = get_bounded_index(j);
    jj = get_bounded_index(jj);
    return [j, jj];
}


function move_ants() {
    for (var i = 0; i < hive.length; i++) {
        var ant = hive[i];
        var new_coords = ant.getCoordsFromOrientation();
        var j = new_coords[0];
        var jj = new_coords[1];

        //Celda a la que se va a mover la hormiga
        var celda = grid[j][jj];
        if (!(celda.hasAnt())) {
            //Encuentra comida
            if (celda.foodLevel > 0 && (ant.has_food === false)) {
                celda.foodLevel--;
                ant.has_food = true;
                ant.last_signal = 1;
                gathered_food++;
                $('#display-gathered-food').html(gathered_food);
            }
            // LLevarlas a la colmena
            if (celda.nest === false && ant.has_food) {
                var newDistance = nest.calcDistance(j, jj);
                var oldDistance = nest.calcDistance(ant.i, ant.ii);
                if (newDistance >= oldDistance) {
                    ant.orientation += (Math.random() * 360);
                    new_coords = ant.getCoordsFromOrientation();
                    j = new_coords[0];
                    jj = new_coords[1];
                }
                grid[j][jj].signal = ant.last_signal;
            }
            // Llega a la colmena y descarga la comida
            if (celda.nest && grid[ant.i][ant.ii].ant.has_food) {
                grid[ant.i][ant.ii].ant.has_food = false;
                delivered_food++;
                $('#display-delivered-food').html(delivered_food);
            }
            //Libre, con y sin comida
            var last = ant.last_signal;
            var next;
            var current = grid[j][jj].signal;

            if (celda.nest === false) {
                //Buscar señales
                for (var s = ant.i - 1; s < ant.i + 1; s++) {
                    for (var ss = ant.ii - 1; ss < ant.ii + 1; ss++) {
                        s = get_bounded_index(s);
                        ss = get_bounded_index(ss);

                        next = grid[s][ss];
                        var signal = next.signal;
                        if (signal > 0 && !(next.hasAnt())) {
                            if (!ant.has_food) {
                                if (last === 0) {
                                    j = s;
                                    jj = ss;
                                } else {
                                    if (signal < last) {
                                        j = s;
                                        jj = ss;
                                        ant.last_signal = signal;
                                    }
                                }
                            }
                        }
                    }
                }
                moveTo(ant, j, jj);
            }
        }
        try {
            if (grid[ant.i][ant.ii].ant.orientation){
                grid[ant.i][ant.ii].ant.orientation += (Math.random() * 45) - 22;
            }
            else{
                grid[ant.i][ant.ii].ant.orientation = (Math.random() * 45) - 22;
            }
        } catch (err) {
            console.log(err)
        }
    }

}

function moveTo(ant, j, jj) {
    var lastGridSignal = grid[ant.i][ant.ii].signal;
    var last = ant.last_signal;
    if (last === 0 && lastGridSignal !== 0) {
        ant.last_signal = lastGridSignal;
    }
    grid[ant.i][ant.ii].ant = false;
    ant.i = j;
    ant.ii = jj;
    grid[j][jj].ant = ant;
}

function placeFood(i, ii) {
    let xCenter = i;
    let yCenter = ii;
    let foodRadius = 6;

    for (let a = xCenter; a < (xCenter + foodRadius); a++) {
        for (let b = yCenter; b < yCenter + foodRadius; b++) {
            let celda = grid[a][b];
            if (!(celda.nest) && nest.calcDistance(i, ii) > 10) {
                celda.foodLevel = 2;
            }
        }
    }
}

//Raiz de la suma de la diferencia de los cuadrados
//Formula de distancia de toda la vida
function calc_distance(i, ii, j, jj) {
    return Math.pow(Math.pow(Math.abs(i - j), 2) + Math.pow(Math.abs(ii - jj), 2), 0.5);
}

/*
Borrar el canvas
 */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
}

// function sense_signal() {
//     for (var i = 0; i < cols; i = i + 1) {
//         for (var ii = 0; ii < rows; ii = ii + 1) {
//             if (grid[i][ii].hasAnt()) {
//                 grid[i][ii].ant.last_signal = grid[i][ii].signal;
//             }
//         }
//     }
// }
function mainLoop() {
    clearCanvas();
    drawNest();
    move_ants();
    drawCells();
    move_ant_out_of_nest();
    // sense_signal();
    // requestAnimationFrame(mainLoop)
}

//Crear terreno [Array de objetos=> grid]
createGrid();

//Comida inicial
placeFood(100, 120);
// Generacion automatica de comida y hormigas en el tiempo
// setInterval(function () {
//     var i = get_bounded_index(Math.floor(Math.random()*150));
//     var ii = get_bounded_index(Math.floor(Math.random()*150));
//     placeFood(i, ii);
//     if(ants_on_grid < max_ants_on_grid){
//         ants_on_grid +=100;
//     }
// }, 1500);
//Iniciar Loop
setInterval(mainLoop, 50);

// mainLoop();