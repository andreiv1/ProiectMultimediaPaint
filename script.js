const shapeType = { "line": 1, "ellipse": 2, "rectangle": 3 }
const shapeName = ["shapeNames", "line", "ellipse", "rectangle"]
const UNSELECTED_SHAPE = -1;

const defaultColor = '#000000';
const defaultBgColor = 'white'
const defaultLineWidth = 1;
var canvas, context;

var drawingStatus = false;
var selectedShape = UNSELECTED_SHAPE;
var currentColor = defaultColor;
var currentLineWidth = defaultLineWidth;
var bgColor = defaultBgColor;
var bgColorStatus = false;
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
    if (selectedShape != UNSELECTED_SHAPE && bgColorStatus == false) {
        drawingStatus = true;
        console.log('%cMouse is Down (ON)', 'color: green; background: yellow; font-size: 15px');
        updateMousePosition(e);
        sX = mX;
        sY = mY;
    }
}

//moving while mouse is active
function mouseMove(e) {
    if (drawingStatus && bgColorStatus == false) {
        updateMousePosition(e);
        if (sX == mX && sY == mY) {
            //do not draw empty points
            return;
        }
        if (selectedShape == shapeType['line']) {
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
    if (bgColorStatus == true) {
        resetCanvas();
    } else {
        if (sX == mX && sY == mY) {
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
        else if (selectedShape == shapeType['ellipse']) {
            let horizontalRadius = Math.abs(mX - sX), verticalRadius = Math.abs(mY - sY);
            if (e.ctrlKey) {
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
}
function resetCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    console.log('bgColor', bgColor);
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height)
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
            context.strokeStyle = rectangle.color;
            context.lineWidth = 1;
            context.fillRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
            context.stroke();

        } else if (shape.type == shapeType['ellipse']) {
            let ellipse = Shapes[i];
            context.beginPath();
            context.ellipse(ellipse.x, ellipse.y, ellipse.horizontalRadius, ellipse.verticalRadius, 0, 0, 2 * Math.PI);
            context.lineWidth = 1;
            context.fillStyle = ellipse.color;
            context.strokeStyle = ellipse.color;
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
        context.lineWidth = currentLineWidth;
        context.strokeStyle = currentColor;
        context.moveTo(sX, sY);
        context.lineTo(mX, mY);
        context.stroke();
    }
}

function drawRectangle(isCtrlPressed = false) {
    resetCanvas();
    if (drawingStatus) {
        context.beginPath();
        context.lineWidth = 1;
        context.fillStyle = currentColor;
        context.fill();
        if (isCtrlPressed) {
            //draw square
            context.fillRect(sX, sY, mX - sX, mX - sX);
        } else {
            //draw rectangle
            context.fillRect(sX, sY, mX - sX, mY - sY);
        }
        context.stroke();
    }
}

function drawEllipse(isCtrlPressed = false) {
    resetCanvas();
    if (drawingStatus) {
        context.beginPath();
        context.lineWidth = 1;
        context.fillStyle = currentColor;
        context.strokeStyle = currentColor;
        if (isCtrlPressed) {
            //draw circle
            context.ellipse(sX, sY, Math.abs(mX - sX), Math.abs(mX - sX), 0, 0, 2 * Math.PI);
        } else {
            //draw ellipse
            context.ellipse(sX, sY, Math.abs(mX - sX), Math.abs(mY - sY), 0, 0, 2 * Math.PI);

        }
        context.fill();
        context.stroke();

    }
}

const popupMarginLeft = 180;
const popupMarginTop = 30; 
function loadShapesList() {
    shapesList.innerHTML = '';
    let countLines = 0, countEllipses = 0, countRectangles = 0;
    let warningListEmpty = document.getElementById('shapesListEmpty')
    if (Shapes.length > 0) {
        warningListEmpty.style.display = 'none';

    } else {
        warningListEmpty.style.display = 'block';
    }
    for (let i = 0; i < Shapes.length; i++) {
        let shape = Shapes[i];
        let li = document.createElement('li')
        // li.innerHTML = JSON.stringify(shape);
        let span = document.createElement('span')
        span.className = 'shapeTitle'
        li.appendChild(span)
        
        span.innerHTML += shapeName[shape.type]
        if (shape.type == shapeType['line']) {
            countLines++;
            span.innerHTML += ' #' + countLines;
        } else if (shape.type == shapeType['ellipse']) {
            countEllipses++;
            span.innerHTML += ' #' + countEllipses;
        }
        else if (shape.type == shapeType['rectangle']) {
            countRectangles++;
            span.innerHTML += ' #' + countRectangles;
        }
        
        let div = document.createElement('div');
        div.className = 'optionIcons';
        let iconOptions = document.createElement('i')
        iconOptions.className = 'fa fa-ellipsis-v optionIcon'
        let iconDelete = document.createElement('i')
        iconDelete.className = 'fas fa-trash-alt optionIcon'
        li.appendChild(div)
        div.appendChild(iconOptions)
        div.appendChild(iconDelete)
        li.className = 'object'
        li.dataset.id = i;

        iconDelete.addEventListener('click', (e) => {
            e.preventDefault();

            deleteShape(i)
        })

        //POPUP FOR LINE
        if (shape.type == shapeType['line']) {
            var popupLine = document.querySelector('.popupLine');
            iconOptions.addEventListener('click', (e) => {
                e.preventDefault();

                closePopup();
                console.log("Line options clicked");
                let mX = e.clientX - popupMarginLeft;
                let mY = e.clientY + popupMarginTop;

                popupLine.style = `display: block; left: ${mX}px; top: ${mY}px;`


                let startX = document.getElementById('startX')
                let startY = document.getElementById('startY')
                let endX = document.getElementById('endX')
                let endY = document.getElementById('endY')

                startX.value = shape.startX;
                startY.value = shape.startY;
                endX.value = shape.endX;
                endY.value = shape.endY;

                startX.dataset.shapeId = i;
                startY.dataset.shapeId = i;
                endX.dataset.shapeId = i;
                endY.dataset.shapeId = i;

                startX.addEventListener('change', (e) => {
                    let shapeId = startX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.startX = parseFloat(startX.value)
                    resetCanvas();
                });
                startY.addEventListener('change', (e) => {
                    let shapeId = startX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.startY = parseFloat(startY.value)
                    resetCanvas();
                });
                endX.addEventListener('change', (e) => {
                    let shapeId = startX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.endX = parseFloat(endX.value)
                    resetCanvas();
                });
                endY.addEventListener('change', (e) => {
                    let shapeId = startX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.endY = parseFloat(endY.value)
                    resetCanvas();
                })
            });
        } 
        //POPUP FOR ELLIPSE
        else if (shape.type == shapeType['ellipse']) {
            var popupEllipse = document.querySelector('.popupEllipse');
            iconOptions.addEventListener('click', (e) => {
                e.preventDefault();
                closePopup();
                console.log("Rectangle options clicked");
                let mX = e.clientX - popupMarginLeft;
                let mY = e.clientY + popupMarginTop;

                popupEllipse.style = `display: block; left: ${mX}px; top: ${mY}px;`
  

                let elX = document.getElementById('elX')
                let elY = document.getElementById('elY')
                let elHRad = document.getElementById('elHRad')
                let elVRad = document.getElementById('elVRad')

                elX.value = shape.x;
                elY.value = shape.y;
                elHRad.value = shape.horizontalRadius;
                elVRad.value = shape.verticalRadius;

                elX.dataset.shapeId = i;

                elX.addEventListener('change', (e) => {
                    let shapeId = elX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.x = elX.value;
                    resetCanvas();
                })

                elY.addEventListener('change', (e) => {
                    let shapeId = elX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.y = elY.value;
                    resetCanvas();
                })
                elHRad.addEventListener('change', (e) => {
                    let shapeId = elX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.horizontalRadius = Math.abs(elHRad.value);
                    resetCanvas();
                })
                elVRad.addEventListener('change', (e) => {
                    let shapeId = elX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.verticalRadius = Math.abs(elVRad.value);
                    resetCanvas();
                })
            });
        } 
        //POPUP FOR RECTANGLE
        else if (shape.type == shapeType['rectangle']) {
            var popupRectangle = document.querySelector('.popupRectangle');
            iconOptions.addEventListener('click', (e) => {
                e.preventDefault();
                closePopup();
                console.log("Rectangle options clicked");
                let mX = e.clientX - popupMarginLeft;
                let mY = e.clientY + popupMarginTop;

                popupRectangle.style = `display: block; left: ${mX}px; top: ${mY}px;`

                let rectX = document.getElementById('rectX')
                let rectY = document.getElementById('rectY')
                let rectW = document.getElementById('rectW')
                let rectH = document.getElementById('rectH')

                rectX.value = shape.x;
                rectY.value = shape.y;
                rectW.value = shape.w;
                rectH.value = shape.h;

                rectX.dataset.shapeId = i;

                rectX.addEventListener('change', (e) => {
                    let shapeId = rectX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.x = rectX.value;
                    resetCanvas();
                });

                rectY.addEventListener('change', (e) => {
                    let shapeId = rectX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.y = rectY.value;
                    resetCanvas();
                });

                rectW.addEventListener('change', (e) => {
                    let shapeId = rectX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.w = rectW.value;
                    resetCanvas();
                })
                rectH.addEventListener('change', (e) => {
                    let shapeId = rectX.dataset.shapeId;
                    let selShape = Shapes[shapeId]
                    selShape.h = rectH.value;
                    resetCanvas();
                })
            });
        }
        shapesList.append(li)
    }
}

function deleteShape(shapeId) {
    Shapes.splice(shapeId, 1);
    closePopup();
    resetCanvas();
}
function addColorsListeners() {
    var colors = document.querySelectorAll('.options.colors>li')
    for (let i = 0; i < colors.length - 1; i++) {
        let color = colors[i];
        color.addEventListener('click', (e) => {

            if (bgColorStatus) {
                bgColor = color.style.backgroundColor;
            } else {
                currentColor = color.style.backgroundColor;
            }
        })
        // console.log(color.style.backgroundColor);
    }
}

function closePopup() {
    elements = document.getElementsByClassName('popup')
    for (let element of elements) {
        element.style.display = 'none';
    }
}

function exportRaster() {
    console.log('Exporting raster..')
    let link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'Exported_' +  getCurrentTime() + '.png';
    link.click();
}

function convertToSvg() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', canvas.width);
    svg.setAttribute('height', canvas.height);
    if (bgColor != defaultBgColor) {

        // this solution makes the entire surface background color
        // let style = document.createElement('style')
        // style.innerText = 'svg {background-color: ' + bgColor + '; }'
        // svg.append(style)


        // workaround to make it only the canvas size
        let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
        rect.setAttribute('x', 0);
        rect.setAttribute('y', 0);
        rect.setAttribute('width', canvas.width);
        rect.setAttribute('height', canvas.height);
        rect.setAttribute('fill', bgColor);
        svg.appendChild(rect);
    }
    for (let shape of Shapes) {
        switch (shape.type) {
            case shapeType['line']:
                let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute('x1', shape.startX);
                line.setAttribute('y1', shape.startY);
                line.setAttribute('x2', shape.endX);
                line.setAttribute('y2', shape.endY);

                if (shape.color) line.setAttribute('stroke', shape.color);
                if (shape.lineWidth) line.setAttribute('stroke-width', shape.lineWidth);
                svg.append(line)
                break;
            case shapeType['ellipse']:
                let ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse")
                ellipse.setAttribute('cx', shape.x);
                ellipse.setAttribute('cy', shape.y);
                ellipse.setAttribute('rx', shape.horizontalRadius);
                ellipse.setAttribute('ry', shape.verticalRadius);

                if (shape.color) ellipse.setAttribute('fill', shape.color);
                svg.append(ellipse)
                break;
            case shapeType['rectangle']:
                let rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect")
                rectangle.setAttribute('x', shape.x);
                rectangle.setAttribute('y', shape.y);
                rectangle.setAttribute('width', shape.w);
                rectangle.setAttribute('height', shape.h);

                if (shape.color) rectangle.setAttribute('fill', shape.color);
                svg.append(rectangle);
                break;
        }
    }
    var xmlSerializer = new XMLSerializer();

    let link = document.createElement('a');
    link.download = 'Exported_' + getCurrentTime() + '.svg';
    link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xmlSerializer.serializeToString(svg))
    link.click()

}

function getCurrentTime() {
    let date = new Date(Date.now());
    return date.toISOString().slice(0, 19).replace('T', ' ').replace(' ','-').replace(':','-');
}
function changeCursorStyle() {
    if (bgColorStatus == true) {
        canvas.style.cursor = `url("assets/bg-color.svg"),auto`;
    } else {
        canvas.style.cursor = 'crosshair';
    }
}

function activateButton(selectedBtn) {
    selectedBtn.style = `filter: invert(17%) sepia(90%) saturate(3000%) hue-rotate(900deg)
    brightness(100%) contrast(100%)`;
    if (shapeEllipse != selectedBtn)
        shapeEllipse.removeAttribute('style');
    if (shapeRectangle != selectedBtn)
        shapeRectangle.removeAttribute('style');
    if (shapeLine != selectedBtn)
        shapeLine.removeAttribute('style');
    if (document.getElementById('changeBackground') != selectedBtn)
        document.getElementById('changeBackground').removeAttribute('style');


}
app = () => {
    canvas = document.querySelector('canvas');
    canvas.style.cursor = 'crosshair'
    context = canvas.getContext('2d');

    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height)


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
        bgColorStatus = false;
        activateButton(shapeEllipse);
        changeCursorStyle();
    });

    shapeRectangle.addEventListener('click', (e) => {
        selectedShape = shapeType['rectangle'];
        bgColorStatus = false;
        activateButton(shapeRectangle);
        changeCursorStyle();
    });

    shapeLine.addEventListener('click', (e) => {
        selectedShape = shapeType['line'];
        bgColorStatus = false;
        activateButton(shapeLine);
        changeCursorStyle();
    });


    colorPicker.addEventListener('change', (e) => {
        if (bgColorStatus) {
            bgColor = colorPicker.value;
        } else {
            currentColor = colorPicker.value;
        }
    })

    lineWidthRange.addEventListener('change', (e) => {
        currentLineWidth = parseInt(lineWidthRange.value);
    })

    var shapesList = document.getElementById('shapesList');
    addColorsListeners();

    // var popup = document.querySelector('.popupLine');

    for (let btn of document.getElementsByClassName('closePopup')) {
        btn.addEventListener('click', (e) => {
            closePopup();
        })
    }

    document.getElementById('btnRaster').addEventListener('click', (e) => {
        exportRaster();
    });

    document.getElementById('btnSvg').addEventListener('click', (e) => {
        convertToSvg();
    });


    document.getElementById('changeBackground').addEventListener('click', (e) => {
        bgColorStatus = true;
        changeCursorStyle()
        activateButton(document.getElementById('changeBackground'));
    });

}

document.addEventListener('DOMContentLoaded', app);