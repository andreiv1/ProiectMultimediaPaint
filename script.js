const shapeType = { "line": 1, "ellipse": 2, "rectangle": 3 }
const UNSELECTED_SHAPE = -1;
const selectedBackgroundColor = 'springgreen';

var canvas, context;

var drawingStatus = false;
var selectedShape = UNSELECTED_SHAPE;

var Lines = [];
var Ellipses = [];
var Rectangles = [];

//Current mouse position:
var mX = 0, mY = 0;
//Current shape positon
var sX = 0, sY = 0;

function updateMousePosition(e) {
    let bounds = canvas.getBoundingClientRect();
    mX = e.x - bounds.left;
    mY = e.y - bounds.top;

}

//mouse is active
function mouseDown(e) {
    if (selectedShape != UNSELECTED_SHAPE) {
        drawingStatus = true;
        console.log('%cMouse is Down (ON)', 'color: green; background: yellow; font-size: 15px');
        updateMousePosition(e);
        sX = mX;
        sY = mY;
    }
}

//moving while mouse is active
function mouseMove(e) {
    if (drawingStatus) {
        updateMousePosition(e);
        if (selectedShape == shapeType['line']) {
            drawLine();
        }
        if (selectedShape == shapeType['rectangle']){
            drawRectangle();
        }
        if (selectedShape == shapeType['ellipse']){
            drawEllipse();
        }
    }
}

//mouse is inactive
function mouseUp(e) {
    drawingStatus = false;
    console.log('mouse is up (OFF)')

    if (selectedShape == shapeType['line']) {
        Lines.push({ startX: sX, startY: sY, endX: mX, endY: mY })
        drawLine();
    }
    if (selectedShape == shapeType['rectangle']){
        Rectangles.push({x: sX, y: sY, w: mX-sX, h: mY-sY})
        drawRectangle();
    }
    if (selectedShape == shapeType['ellipse']){
        Ellipses.push({x: sX, y: sY, horizontalRadius: Math.abs(mX-sX), verticalRadius: Math.abs(mY-sY)})
        drawEllipse();
    }
}
function resetCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < Lines.length; i++) {
        let line = Lines[i]
        context.moveTo(line.startX, line.startY);
        context.lineTo(line.endX, line.endY);
        context.stroke();
    }
    for (let i = 0; i < Rectangles.length; i++){
        let rectangle = Rectangles[i]
        context.beginPath();
        context.fillRect(rectangle.x,rectangle.y,rectangle.w,rectangle.h);
        context.stroke();
    }
    for (let i = 0; i < Ellipses.length; i++) {
        let ellipse = Ellipses[i]
        context.beginPath();
        context.ellipse(ellipse.x,ellipse.y,ellipse.horizontalRadius,ellipse.verticalRadius,0,0,2*Math.PI);
        context.fill();
        context.stroke();
    }
}

function drawLine() {
    resetCanvas();
    if (drawingStatus) {
        context.beginPath();
        context.moveTo(sX, sY);
        context.lineTo(mX, mY);
        context.stroke();
    }
}

function drawRectangle(){
    resetCanvas();
    if(drawingStatus){
        context.beginPath();
        context.fillRect(sX,sY,mX-sX,mY-sY);
        context.stroke();
    }
}

function drawEllipse(){
    resetCanvas();
    if(drawingStatus){
        context.beginPath();
        context.ellipse(sX,sY,Math.abs(mX-sX),Math.abs(mY-sY),0,0,2*Math.PI);
        context.fill();
        context.stroke();
    
    }
}


app = () => {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');

    var shapeEllipse = document.getElementById('shapeEllipse');
    var shapeRectangle = document.getElementById('shapeRectangle');
    var shapeLine = document.getElementById('shapeLine');

    shapeEllipse.addEventListener('click', (e) => {
        selectedShape = shapeType['ellipse'];
    });

    shapeRectangle.addEventListener('click', (e) => {
        selectedShape = shapeType['rectangle'];
    });

    shapeLine.addEventListener('click', (e) => {
        selectedShape = shapeType['line'];
    });

    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mousedown', mouseDown);
}

document.addEventListener('DOMContentLoaded', app);