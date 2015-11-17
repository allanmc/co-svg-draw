/* create an svg drawing */
var draw = SVG('drawing')
var socket = io();

/* draw rectangle */
var rect;
var inProgressRectMap = new Map();
var drawEvent={};
var guid = guid();
var color = '#D91E1E';
var tool = 'square';

function updateColor(picker) {
	color = picker.toHEXString();
}

function setTool(tool) {
	this.tool = tool;
}

draw.on('mousedown', function(e){
    if (tool == 'line') {
        rect = draw.line(0, 0, 0, 0)
            .stroke({ width: 1, color: color });
    } else {
        rect = draw.rect()
            .fill(color);
    }
    rect.draw(e);
}, false);

draw.on('mousemove', function (e) {
	if (e.buttons == 1) {

        if (tool == 'line') {
            var points = rect.array().value;
            drawEvent.x = points[0][0];
            drawEvent.y = points[0][1];
            drawEvent.x2 = points[1][0];
            drawEvent.y2 = points[1][1];
        } else {
            var tbox = rect.tbox();
            drawEvent.width = tbox.width;
            drawEvent.height = tbox.height;
            drawEvent.x = tbox.x;
            drawEvent.y = tbox.y;
        }
        drawEvent.type = tool;
        drawEvent.guid = guid;
        drawEvent.color = color;


        socket.emit('drawingProgress', drawEvent);
	}
});

draw.on('mouseup', function(e){
	rect.draw('stop', e);

    if (tool == 'line') {
        var points = rect.array().value;
        drawEvent.x = points[0][0];
        drawEvent.y = points[0][1];
        drawEvent.x2 = points[1][0];
        drawEvent.y2 = points[1][1];
    } else {
        var tbox = rect.tbox();
        drawEvent.width = tbox.width;
        drawEvent.height = tbox.height;
        drawEvent.x = tbox.x;
        drawEvent.y = tbox.y;
    }
    drawEvent.type = tool;
    drawEvent.guid = guid;
    drawEvent.color = color;

	socket.emit('drawing', drawEvent);
}, false);

draw.on('drawstop', function(){
	// remove listener
});

/* write text at the back */
draw.text('Co SVG Draw')
	.back()
	.fill('#ccc')
	.move('50%', '40%')
	.font({
		family: 'Source Sans Pro',
		size: 18,
		anchor: 'middle'
	});

function drawObject(drawEvent){
    if(guid != drawEvent.guid) {
        if(inProgressRectMap.has(drawEvent.guid)){
            inProgressRectMap.get(drawEvent.guid).remove();
            inProgressRectMap.delete(drawEvent.guid);
        }
        if (drawEvent.type == 'line') {
            draw.line(drawEvent.x, drawEvent.y, drawEvent.x2, drawEvent.y2)
                .stroke({ width: 1, color: drawEvent.color});
        } else {
            draw.rect(drawEvent.width, drawEvent.height)
                .move(drawEvent.x,drawEvent.y)
                .fill(drawEvent.color);
        }

    }
}

function drawObjectInProgress(drawEvent){
    if(guid != drawEvent.guid) {
        if(!inProgressRectMap.has(drawEvent.guid)){
            if (drawEvent.type == 'line') {
                inProgressRectMap.set(drawEvent.guid, draw.line());
            } else {
                inProgressRectMap.set(drawEvent.guid, draw.rect());
            }

        }
        var svgObj = inProgressRectMap.get(drawEvent.guid);
        if (drawEvent.type == 'line') {
            svgObj.plot(drawEvent.x, drawEvent.y, drawEvent.x2, drawEvent.y2)
                .stroke({ width: 1, color: drawEvent.color });
        } else {

            svgObj.width(drawEvent.width)
                .height(drawEvent.height)
                .move(drawEvent.x, drawEvent.y)
                .fill(drawEvent.color);
        }

        svgObj.front();
    }
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function emitClearEvent() {
    socket.emit('clearDrawing');
}

function clearDrawing() {
    draw.clear();
}