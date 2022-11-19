const shapeType = { "line": 1, "ellipse": 2, "rectangle": 3 }
const shapeName = ["shapeNames","line", "ellipse", "rectangle"]
const UNSELECTED_SHAPE = -1;

const defaultColor = '#000000';
const defaultLineWidth = 1;
var canvas, context;

var drawingStatus = false;
var selectedShape = UNSELECTED_SHAPE;
var currentColor = defaultColor;
var currentLineWidth = defaultLineWidth;

var Shapes = [];

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
        if (selectedShape == shapeType['line']
        && (sX != mX && sY != mY)) {
            drawLine();
        }
        if (selectedShape == shapeType['rectangle']) {
            drawRectangle(e.ctrlKey);
        }
        if (selectedShape == shapeType['ellipse']) {
            drawEllipse(e.ctrlKey);
        }
    }
}

//mouse is inactive
function mouseUp(e) {
    drawingStatus = false;
    console.log('%cMouse is up (OFF)', 'color: red; background: yellow; font-size: 15px');
    if(sX == mX && sY == mY){
        //do not draw empty points
        return;
    }
    //save the shape the user drew
    if (selectedShape == shapeType['line']) {
        Shapes.push({
            startX: sX, startY: sY, endX: mX, endY: mY,
            color: currentColor,
            lineWidth: currentLineWidth,
            type: shapeType['line']
        })
        drawLine();
    }
    else if (selectedShape == shapeType['rectangle']) {
        let squareW = mX - sX, squareH = mY - sY;
        if (e.ctrlKey) {
            //if ctrl is pressed, draw a square
            squareH = squareW;
        } 
        Shapes.push({
            x: sX, y: sY, w: squareW, h: squareH,
            color: currentColor,
            type: shapeType['rectangle']
        })
        drawRectangle(e.ctrlKey);
    }
    else if (selectedShape == shapeType['ellipse']){
        let horizontalRadius = Math.abs(mX - sX), verticalRadius = Math.abs(mY - sY);
        if(e.ctrlKey) {
            verticalRadius = horizontalRadius;
        }
        Shapes.push({
            x: sX, y: sY, horizontalRadius: horizontalRadius, verticalRadius: verticalRadius,
            color: currentColor,
            type: shapeType['ellipse']
        })
    }

    console.log('%cShapes:', 'color: orange; font-size: 11px');
    console.log(Shapes);
    loadShapesList()
}
function resetCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < Shapes.length; i++) {
        let shape = Shapes[i];
        if (shape.type == shapeType['line']) {
            let line = Shapes[i];
            context.beginPath();
            context.moveTo(line.startX, line.startY);
            context.lineTo(line.endX, line.endY);
            context.lineWidth = line.lineWidth;
            context.strokeStyle = line.color;
            context.stroke();

        } else if (shape.type == shapeType['rectangle']) {
            let rectangle = Shapes[i];
            context.beginPath();
            context.fillStyle = rectangle.color;
            context.fillRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
            context.stroke();

        } else if (shape.type == shapeType['ellipse']) {
            let ellipse = Shapes[i];
            context.beginPath();
            context.ellipse(ellipse.x, ellipse.y, ellipse.horizontalRadius, ellipse.verticalRadius, 0, 0, 2 * Math.PI);
            context.fillStyle = ellipse.color;
            context.fill();
            context.stroke();
        }
    }
    loadShapesList()
}

function drawLine() {
    resetCanvas();
    if (drawingStatus) {
        context.beginPath();
        context.moveTo(sX, sY);
        context.lineTo(mX, mY);
        context.lineWidth = currentLineWidth;
        context.strokeStyle = currentColor;
        context.stroke();
    }
}

function drawRectangle(isCtrlPressed = false) {
    resetCanvas();
    if (drawingStatus) {
        context.beginPath();
        if (isCtrlPressed) {
            //draw square
            context.fillRect(sX, sY, mX - sX, mX - sX);
        } else {
            //draw rectangle
            context.fillRect(sX, sY, mX - sX, mY - sY);
        }
        context.fillStyle = currentColor;
        context.fill();
        context.stroke();
    }
}

function drawEllipse(isCtrlPressed = false) {
    resetCanvas();
    if (drawingStatus) {
        context.beginPath();
        if (isCtrlPressed) {
            //draw circle
            context.ellipse(sX, sY, Math.abs(mX - sX), Math.abs(mX - sX), 0, 0, 2 * Math.PI);
        } else {
            //draw ellipse
            context.ellipse(sX, sY, Math.abs(mX - sX), Math.abs(mY - sY), 0, 0, 2 * Math.PI);

        }
        context.fillStyle = currentColor;
        context.strokeStyle = currentColor;
        context.fill();
        context.stroke();

    }
}

function loadShapesList(){
    shapesList.innerHTML = '';
    let countLines = 0, countEllipses = 0, countRectangles = 0;
    let warningListEmpty = document.getElementById('shapesListEmpty')
    if(Shapes.length > 0){
        warningListEmpty.style.display = 'none';
        
    } else {
        warningListEmpty.style.display = 'block';
    }
    for(let i = 0; i < Shapes.length; i++){
        let shape = Shapes[i];
        let li = document.createElement('li')
        // li.innerHTML = JSON.stringify(shape);
        li.innerHTML = '<span class="shapeTitle">'
        li.innerHTML += shapeName[shape.type]
        if(shape.type == shapeType['line']) {
            countLines++;
            li.innerHTML += ' #' + countLines;
        } else if(shape.type == shapeType['ellipse']){
            countEllipses++;
            li.innerHTML += ' #' + countEllipses;
        }
        else if(shape.type == shapeType['rectangle']){
            countRectangles++;
            li.innerHTML += ' #' + countRectangles;
        }
        li.innerHTML += '</span>'
        let iconOptions = document.createElement('i')
        iconOptions.className = 'fa fa-ellipsis-v optionIcon'
        let iconDelete = document.createElement('i')
        iconDelete.className = 'fas fa-trash-alt optionIcon'
        li.appendChild(iconOptions)
        li.appendChild(iconDelete)
        li.className = 'object'
        li.dataset.id = i; 
        iconDelete.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("delete clicked");
            deleteShape(i)})
        iconOptions.addEventListener('click', (e) =>{
            e.preventDefault();
            console.log("options clicked");
        });
        shapesList.append(li)
    }
}

function deleteShape(shapeId){
    // alert('Are you sure you want to delete the selected shape?')
    Shapes.splice(shapeId, 1);
    resetCanvas();
}
function addColorsListeners(){
    var colors = document.querySelectorAll('.options.colors>li')
    for(let i = 0; i < colors.length-1; i++)
    {
        let color = colors[i];
        color.addEventListener('click', (e) => {
            currentColor = color.style.backgroundColor;
        })
        // console.log(color.style.backgroundColor);
    }
}

app = () => {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');

    var shapeEllipse = document.getElementById('shapeEllipse');
    var shapeRectangle = document.getElementById('shapeRectangle');
    var shapeLine = document.getElementById('shapeLine');
    var colorPicker = document.getElementById('colorPicker');
    var lineWidthRange = document.getElementById('lineWidthRange');

    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mousedown', mouseDown);

    shapeEllipse.addEventListener('click', (e) => {
        selectedShape = shapeType['ellipse'];
    });

    shapeRectangle.addEventListener('click', (e) => {
        selectedShape = shapeType['rectangle'];
    });

    shapeLine.addEventListener('click', (e) => {
        selectedShape = shapeType['line'];
    });


    colorPicker.addEventListener('change', (e) => {
        currentColor = colorPicker.value;
    })

    lineWidthRange.addEventListener('change', (e) => {
        currentLineWidth = parseInt(lineWidthRange.value);
    })

    var shapesList = document.getElementById('shapesList');
    addColorsListeners();
}

document.addEventListener('DOMContentLoaded', app);