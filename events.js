///                   ///
/// event Declaration ///
///                   ///

window.addEventListener('DOMContentLoaded', pre);

window.addEventListener("resize", resizeCanvas);

///                 ///
/// Event Functions ///
///                 ///

function resizeCanvas(event){
    if(context != null){
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
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
    currentVector = parseInt(document.getElementById("vector").value);
    if(vectors[currentVector] == null){
        vectors[currentVector] = new Vector();
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