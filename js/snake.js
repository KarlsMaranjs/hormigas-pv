//Select Canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

//Properties
var snakeSize = 10;
var width = canvas.width;
var height = canvas.height;
var score = 0;
var snake, food;

var drawModule = function () {
    var bodySnake = function (x, y) {
        ctx.fillStyle = "green";
        ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
    };
    var pizza = function (x, y) {

    }
};

