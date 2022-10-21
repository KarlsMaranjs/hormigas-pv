//Select canvas
var canvas = document.getElementById("ground");
var ctx = canvas.getContext("2d");

//Config
var antsNumber = 1;
var foodNumber = 1;
var antPopulation = [];
var cellSize = 4;
// var cols = 200;
var cols = canvas.width/cellSize;
var rows = canvas.height/cellSize;
// var rows = 200;
var grid = [];
var temp_grid = [];
var _data;
var nest_coords =[];
var max_ants_on_grid = 200;
var ants_on_grid = 100;
var ants_out_of_nest =0;
var gathered_food = 0;
var delivered_food =0;
var hive =[];
var signalFade = 0.004;
var nest = new Nest();
Math.to_radians = function(degrees) {
    return degrees * Math.PI / 180;
};

function Cell(i,ii) {
    this.i = i;
    this.ii = ii;
    this.ant = null;
    this.nest = false;
    this.foodLevel = 0;
    this.signal = 0;
    this.has_ant = function() {
        return this.ant ? true : false;
    };
}
function Nest() {
    this.i = 0;
    this.ii =0;
    this.width = 70;
    this.height = 70;
    this.x =(canvas.width/2)-(this.width/2);
    this.y = (canvas.height/2)-(this.height/2);
    this.color = "red";
}
function Ant(i, ii) {
    this.i = i;
    this.ii = ii;
    this.has_food = false;
    this.last_signal = 0;
    this.orientation = Math.random() * 90;
}
function createGrid() {
    for (var i = 0; i < cols; i++) {
        grid[i] =[];
        for (var ii = 0; ii < rows; ii++) {
            //Ubicar el hormiguero
            grid[i][ii] = new Cell(i, ii);
            var celda = grid[i][ii];
            if(i*cellSize>=nest.x && (i*cellSize)<=nest.x+nest.width && ii*cellSize>=nest.y && (ii*cellSize) <=nest.y+nest.height){
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
            if(i*cellSize>=nest.x && (i*cellSize)<=nest.x+nest.width && ii*cellSize>=nest.y && (ii*cellSize) <=nest.y+nest.height){
                ctx.beginPath();
                ctx.strokeStyle="black";
                ctx.strokeRect(i*cellSize, ii*cellSize, cellSize, cellSize);
                ctx.closePath();
            }

        }
    }
}
function get_random_int(min, max) {
    return Math.floor((Math.random() * (max - min + 1))) + min;
}
//Para que las hormigas no escapen
function get_bounded_index(index) {
    var bounded_index = index;
    if (index < 0) {
        bounded_index = 0;
    }
    if (index >= cols) {
        bounded_index = cols-1;
    }
    return bounded_index;
}
function move_ant_out_of_nest() {
    var i = nest.i-3;
    var ii = nest.ii+2;
    var new_coords = get_random_coordinates(i,ii);
    var j = new_coords[0];
    var jj = new_coords[1];
    if (!grid[j][jj].has_ant() && ants_out_of_nest < ants_on_grid) {
        grid[j][jj].ant = new Ant(j, jj);
        hive.push(grid[j][jj].ant);
        ants_out_of_nest++;
        $('#display-total-ants').html(ants_out_of_nest);
    }
}
function get_random_coordinates(i,ii) {
    var j   = get_random_int(i-1, i+1);
    var jj  = get_random_int(ii-1, ii+1);
    j  = get_bounded_index(j);
    jj = get_bounded_index(jj);
    return [j, jj];
}
function drawCells() {
    for(var i=0; i<cols; i++){
        for (var ii=0; ii<rows; ii++){
            var ant = grid[i][ii].ant;

            if (grid[i][ii].foodLevel === 1) {
                ctx.fillStyle="rgba(0, 225, 150, 0.5)";
                ctx.fillRect(i*cellSize, ii*cellSize, cellSize, cellSize);
            }
            else if(grid[i][ii].foodLevel > 1){
                ctx.fillStyle="rgb(0, 225, 0)";
                ctx.fillRect(i*cellSize, ii*cellSize, cellSize, cellSize);
            }
            if(ant){
                if(ant.has_food){
                    ctx.fillStyle="rgb(0, 225, 0)";
                    grid[i][ii].signal = ant.last_signal;
                }
                else {
                    ctx.fillStyle="black";
                }
                ctx.fillRect(i*cellSize, ii*cellSize, cellSize, cellSize);
            }
            // Hacer que la señal se propage hasta las casillas adyacentes.
            if(grid[i][ii].signal>0 && !(grid[i][ii].ant)){
                for (var s = i-1; s <= i + 1; s++) {
                    for (var ss = ii; ss <= ii + 1; ss++) {
                        var s = get_bounded_index(s);
                        var ss = get_bounded_index(ss);
                        var signal = grid[i][ii].signal*0.7;


                        if(s!==i || ss!==ii){
                            signal = signal*0.3;
                        }
                        if(grid[s][ss].signal === 0 || grid[s][ss].signal === false){
                            grid[s][ss].signal = signal;
                        }
                        if(grid[s][ss].signal > 0.1){
                            ctx.fillStyle="rgba(255, 120, 0, "+ signal/2+")";
                            ctx.fillRect(s*cellSize, ss*cellSize, cellSize, cellSize);
                            grid[s][ss].signal -=signalFade;
                        }
                        if(grid[s][ss].signal<=0.1){
                            grid[s][ss].signal =0;
                        }
                    }
                }

            }


        }
    }
    //  for (var a = 70; a<150; a++){
    //     var x = 100;
    //     var gridElementElement = grid[x][a];
    //     signal = ((40/a));
    //
    //     gridElementElement.signal = signal;
    //     var signal = gridElementElement.signal;
    //
    //     if(!(gridElementElement.has_ant())){
    //         ctx.fillStyle = 'rgba(0,0,225,'+signal+')';
    //
    //     }
    //     else {
    //         ctx.fillStyle = 'red';
    //
    //     }
    //     ctx.beginPath();
    //     ctx.fillRect(x*cellSize, a*cellSize, cellSize, cellSize);
    //     ctx.closePath();
    //
    // }
}
function get_coords_from_orientation(ant) {
    var coords = [];
    var orientation_radians = Math.to_radians(ant.orientation);
    coords.push(get_bounded_index(Math.round(ant.i + Math.cos(orientation_radians))));
    coords.push(get_bounded_index(Math.round(ant.ii + Math.sin(orientation_radians))));
    // console.log(coords);
    return coords;
}
function move_ants() {
    for (var i = 0; i < hive.length; i++) {
        var ant = hive[i];
        var new_coords = get_coords_from_orientation(ant);
        // var new_coords = [get_bounded_index(ant.i+1),get_bounded_index(ant.ii+1)];
        var j = new_coords[0];
        var jj = new_coords[1];

        //Celda a la que se va a mover la hormiga
        var celda = grid[j][jj];
        if(!(celda.has_ant())){
            //Encuentra comida
            if(celda.foodLevel >0 && (ant.has_food===false)){
                celda.foodLevel--;
                ant.has_food = true;
                 ant.last_signal =1;
                gathered_food++;
                $('#display-gathered-food').html(gathered_food);
            }
            // LLevarlas a la colmena
            if(celda.nest===false && ant.has_food){
                var newDistance = calc_distance_to_nest(j, jj);
                var oldDistance = calc_distance_to_nest(ant.i, ant.ii);
                if (newDistance >= oldDistance){
                    ant.orientation += (Math.random() * 360);
                    new_coords = get_coords_from_orientation(ant);
                    j = new_coords[0];
                    jj = new_coords[1];
                }
                grid[j][jj].signal = ant.last_signal;
            }
            // Llega a la colmena y descarga la comida
            if(celda.nest && grid[ant.i][ant.ii].ant.has_food){
                grid[ant.i][ant.ii].ant.has_food = false;
                delivered_food++;
                $('#display-delivered-food').html(delivered_food);
            }
            //Libre, con y sin comida
            var last = ant.last_signal;
            var next;
            var current = grid[j][jj].signal;

            if(celda.nest===false){
                //Buscar señales
                for (var s = ant.i-1; s < ant.i+1; s++) {
                    for (var ss = ant.ii-1; ss < ant.ii+1; ss++) {
                        s = get_bounded_index(s);
                        ss = get_bounded_index(ss);

                        next = grid[s][ss];
                        var signal = next.signal;
                            if(signal>0 && !(next.has_ant())){
                                if(!ant.has_food){
                                        if(last===0){
                                            j=s;
                                            jj=ss;
                                        }
                                        else {
                                            if(signal<last){
                                                j=s;
                                                jj=ss;
                                                ant.last_signal = signal;
                                            }
                                        }
                                }
                                // else {
                                //     j=s;
                                //     jj=ss;
                                // }
                        }
                    }
                }
                moveTo(ant, j, jj);
            }
        }
        grid[ant.i][ant.ii].ant.orientation += (Math.random() * 45)-22.5;
    }

}
function moveTo(ant, j, jj) {
    var lastGridSignal = grid[ant.i][ant.ii].signal;
    var last = ant.last_signal;
     if (last === 0 && lastGridSignal!==0){
         ant.last_signal = lastGridSignal;
     }
    grid[ant.i][ant.ii].ant = false;
    ant.i = j;
    ant.ii = jj;
    grid[j][jj].ant = ant;
}
function placeFood(i, ii) {
    this.xCenter = i;
    this.yCenter = ii;
    this.radius = 6;

    for(var a = this.xCenter; a<(this.xCenter+this.radius); a++){
        for(var b=this.yCenter; b<this.yCenter+this.radius; b++){
            var celda = grid[a][b];
            if(!(celda.nest) && calc_distance_to_nest(i, ii) > 10){
                celda.foodLevel = 2;
            }
        }
    }
}
//Raiz de la suma de la diferencia de los cuadrados
//Formula de distancia de toda la vida
function calc_distance(i,ii,j,jj) {
    return Math.pow(Math.pow(Math.abs(i-j),2) + Math.pow(Math.abs(ii-jj),2) , 0.5);
}

function calc_distance_to_nest(i,ii) {
    return calc_distance(i,ii,nest.i-10,nest.ii-10);
}
function Food(i, ii) {
    this.i = i;
    this.ii = ii;
    this.totalFood = 2;
}
/*
Borrar el canvas
 */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// function sense_signal() {
//     for (var i = 0; i < cols; i = i + 1) {
//         for (var ii = 0; ii < rows; ii = ii + 1) {
//             if (grid[i][ii].has_ant()) {
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
placeFood(120,120);
//Generacion automatica de comida y hormigas en el tiempo
// setInterval(function () {
//     var i = get_bounded_index(Math.floor(Math.random()*150));
//     var ii = get_bounded_index(Math.floor(Math.random()*150));
//     placeFood(i, ii);
//     if(ants_on_grid < max_ants_on_grid){
//         ants_on_grid +=100;
//     }
// }, 15000);
//Iniciar Loop
setInterval(mainLoop, 42);

// mainLoop();