///                   ///
/// event Declaration ///
///                   ///

window.addEventListener('DOMContentLoaded', pre);

///                      ///
/// Event Init Functions ///
///                      ///

function initiateEvents(){

    window.addEventListener("resize", resizeCanvas);

}

///                 ///
/// Event Functions ///
///                 ///

function resizeCanvas(event){
    if(context != null){
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        context.translate(lerp(0, canvas.width, 0.5), lerp(0, canvas.height, 0.5));
        time = new Date();
        lastTime = new Date();
        draw();
    }
}

function pre(event){
    canvas = document.createElement("canvas");
    document.getElementById("canvasTab").appendChild(canvas);
    context = canvas.getContext("2d");
    resizeCanvas(null);

    vectors[0] = new Vector();

    initiateEvents();

    testStart();
}

function changeVector(){
    currentVector = Math.abs(parseInt(document.getElementById("vector").value));
    for(var index = 0; index <= currentVector; index++){
        if(vectors[index] instanceof Vector == false){
            vectors[index] = new Vector();
        }
    }
    resetEditor();
}

function changeSize(){
    vectors[currentVector].size = parseFloat(document.getElementById("size").value);
    resetEditor();
}

function changeSpeed(){
    vectors[currentVector].speed = parseFloat(document.getElementById("speed").value);
    resetEditor();
}

function changeBegin(){
    vectors[currentVector].begin = parseFloat(document.getElementById("begin").value);
    resetEditor();
}

function changeState(){
    state = document.getElementById("state").checked;
    if(state == true){
        document.getElementById("vector").setAttribute("disabled", true);
        document.getElementById("size").setAttribute("disabled", true);
        document.getElementById("speed").setAttribute("disabled", true);
        document.getElementById("begin").setAttribute("disabled", true);
    }
    else{
        document.getElementById("vector").removeAttribute("disabled");
        document.getElementById("size").removeAttribute("disabled");
        document.getElementById("speed").removeAttribute("disabled");
        document.getElementById("begin").removeAttribute("disabled");
    }
    resetVector();
    time = new Date();
    lastTime = new Date();
    draw();
    drawPlacesCount = 0;
}

function circleColorChange(){
    circleColor = document.getElementById("circleColor").value;
    resetEditor();
}

function circleArmColorChange(){
    circleArmColor = document.getElementById("circleArmColor").value;
    resetEditor();
}

function lineColorChange(){
    lineColor = document.getElementById("lineColor").value;
    resetEditor();
}

function changeFadeFactor(){
    fadeFactor = Math.abs(parseInt(document.getElementById("fadeFactor").value));
    resetEditor();
}

function bgColorChange(){
    bgColor = document.getElementById("bgColor").value;
    resetEditor();
}