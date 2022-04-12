/*
 * Author: jefvaia
 * GitHub Page: https://github.com/jefvaia/FourierSimJS
 * Message: You may use this code however you like. I don't mind people changing the code at all.
 */

///                          ///
/// Core Variable Definition ///
///                          ///

var canvas = null;
var context = null;

var halfX = 0, halfY = 0;

var state = false;

var vectors = [];
var currentVector = 0;

var time = null, lastTime = null;

var drawPlacesX = [], drawPlacesY = [];
var drawPlacesCount = 0;

var circleColor = "#00FF00";
var circleArmColor = "#0000FF";
var lineColor = "#FF0000";
var bgColor = "#FFFFFF"

var fadeFactor = 0;

function Vector(){
    this.size = 0;
    this.speed = 0;
    this.begin = 0;
    this.angle = 0;
}

///                 ///
/// Reset Functions ///
///                 ///

function resetVector(){
    for(var index = 0; index < vectors.length; index++){
        vectors[index].angle = vectors[index].begin;
    }
}

function resetEditor(){
    document.getElementById("vector").value = currentVector;
    document.getElementById("size").value = vectors[currentVector].size;
    document.getElementById("speed").value = vectors[currentVector].speed;
    document.getElementById("begin").value = vectors[currentVector].begin;
    document.getElementById("fadeFactor").value = fadeFactor;
    resetVector();
    time = new Date();
    lastTime = new Date();
    draw();
}

///                ///
/// Draw Functions ///
///                ///

function clear(){
    context.clearRect(-halfX, -drawPlacesY, canvas.width, canvas.height);

    context.rect(-halfX, -drawPlacesY, canvas.width, canvas.height);
    context.fillStyle = bgColor;
    context.fill();
}

function draw(){
    
    lastTime = time;
    time = new Date();

    var delta = (time.getTime() - lastTime.getTime()) / 1000;

    clear();

    var tempX = 0, tempY = 0;
    var lastX = 0, lastY = 0

    for(var index = 0; index < vectors.length; index++){
        drawCircle(tempX, tempY, vectors[index].size, circleColor, 2);
        tempX += Math.cos(deg2rad(vectors[index].angle)) * vectors[index].size;
        tempY += Math.sin(deg2rad(vectors[index].angle)) * vectors[index].size;
        drawLine(lastX, lastY, tempX, tempY, circleArmColor, 2, false);
        lastX = tempX;
        lastY = tempY;
        vectors[index].angle += vectors[index].speed * delta * 360 / 100;
    }

    if(state == true){
        
        drawPlacesX[drawPlacesCount] = tempX;
        drawPlacesY[drawPlacesCount] = tempY;

        drawPlacesCount++;

        drawBuffer(drawPlacesX, drawPlacesY, lineColor, 4);

        

        window.requestAnimationFrame(draw);
    }
}

function drawCircle(x, y, r, color, thickness){
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
}

function drawLine(x1, y1, x2, y2, color, thickness, original){
    context.beginPath();
    if(original == false){
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
    }
    else{
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
    }
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke(); 
}

function drawBuffer(x, y, color, thickness){

    var fadeWorksUntil = drawPlacesCount - fadeFactor;

    for(var index = 1; index < drawPlacesCount; index++){

        context.beginPath();

        context.moveTo(x[index - 1], y[index - 1]);

        context.lineTo(x[index], y[index]);

        if(fadeFactor != 0){

            var fade1 = "00", fade2 = "00";

            fade1 = invert(clamp(Math.round(255 / fadeFactor * (drawPlacesCount - index - 1)), 0, 255), 0, 255).toString(16);
            fade2 = invert(clamp(Math.round(255 / fadeFactor * (drawPlacesCount - index)), 0, 255), 0, 255).toString(16);

            if(fade1.length == 1){
                fade1 = "0" + fade1;
            }

            if(fade2.length == 1){
                fade2 = "0" + fade2;
            }

            var gradient = context.createLinearGradient(x[index - 1], y[index - 1], x[index], y[index]);
            gradient.addColorStop(0, color + fade1);
            gradient.addColorStop(1, color + fade2);

        }
        else{
            gradient = lineColor;
        }

        context.strokeStyle = gradient;
        context.lineWidth = thickness;

        context.stroke();

    }
}

