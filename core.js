///                          ///
/// Core Variable Definition ///
///                          ///

var canvas = null;
var context = null;

var state = false;

var vectors = [];
var currentVector = 0;

var time = null, lastTime = null;

var drawPlacesX = [], drawPlacesY = [];
var drawPlacesCount = 0;


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
    document.getElementById("size").value = vectors[currentVector].size;
    document.getElementById("speed").value = vectors[currentVector].speed;
    document.getElementById("begin").value = vectors[currentVector].begin;
    resetVector();
    time = new Date();
    lastTime = new Date();
    draw();
}

///                ///
/// Draw Functions ///
///                ///

function draw(){
    
    lastTime = time;
    time = new Date();

    var delta = (time.getTime() - lastTime.getTime()) / 1000;

    context.clearRect(0, 0, canvas.width, canvas.height);

    var tempX = 0, tempY = 0;
    var lastX = 0, lastY = 0

    for(var index = 0; index < vectors.length; index++){
        drawCircle(tempX, tempY, vectors[index].size, "#00FF00", 2);
        tempX += Math.cos(deg2rad(vectors[index].angle)) * vectors[index].size;
        tempY += Math.sin(deg2rad(vectors[index].angle)) * vectors[index].size;
        drawLine(lastX, lastY, tempX, tempY, "#0000FF", 2, false);
        lastX = tempX;
        lastY = tempY;
        vectors[index].angle += vectors[index].speed * delta * 360 / 100;
    }

    if(state == true){
        
        drawPlacesX[drawPlacesCount] = tempX;
        drawPlacesY[drawPlacesCount] = tempY;

        drawPlacesCount++;

        drawBuffer(drawPlacesX, drawPlacesY, "#FF0000", 4);

        window.requestAnimationFrame(draw);
    }
}

function drawCircle(x, y, r, color, thickness){
    context.beginPath();
    context.arc(x + lerp(0, canvas.width, 0.5), y + lerp(0, canvas.height, 0.5), r, 0, 2 * Math.PI);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
}

function drawLine(x1, y1, x2, y2, color, thickness, original){
    context.beginPath();
    if(original == false){
        context.moveTo(x1 + lerp(0, canvas.width, 0.5), y1 + lerp(0, canvas.height, 0.5));
        context.lineTo(x2 + lerp(0, canvas.width, 0.5), y2 + lerp(0, canvas.height, 0.5));
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
    context.beginPath();
    
    context.moveTo(x[0] + lerp(0, canvas.width, 0.5), y[0] + lerp(0, canvas.height, 0.5));

    for(var index = 1; index < drawPlacesCount; index++){

        context.lineTo(x[index] + lerp(0, canvas.width, 0.5), y[index] + lerp(0, canvas.height, 0.5));

    }
    
    context.strokeStyle = color;
    context.lineWidth = thickness;

    context.stroke();
}

