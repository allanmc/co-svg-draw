/* create an svg drawing */
var draw = SVG('drawing')
var socket = io();

var deleting = false;
/* draw rectangle */
var rect;
var inProgressRectMap = new Map();
var drawEvent={};
var clientGuid = guid();
var color = '#D91E1E';
var tool = 'square';

function updateColor(picker) {
	color = picker.toHEXString();
}

function setTool(tool) {
	this.tool = tool;
}

draw.on('mousedown', function(e){
    if (deleting) {
        return;
    }
    if (tool == 'line') {
        rect = draw.line()
            .stroke({ width: 1, color: color });
    }else if(tool == 'circle'){
        rect = draw.circle(0).fill(color);
    } else if (tool == 'text') {
        rect = draw.rect()
            .stroke({width: 1, color: color}).fill({opacity: 0.2, color: color});
    } else {
        rect = draw.rect()
            .fill(color);
    }

    rect.draw(e);
}, false);

draw.on('mousemove', function (e) {
	if (e.buttons == 1 && !deleting) {

        if (tool == 'line') {
            var points = rect.array().value;
            drawEvent.x = points[0][0];
            drawEvent.y = points[0][1];
            drawEvent.x2 = points[1][0];
            drawEvent.y2 = points[1][1];
        }else if(tool == 'circle'){
            drawEvent.x = rect.cx();
            drawEvent.y = rect.cy();
            drawEvent.rx = rect.rx();
            drawEvent.ry = rect.ry();
        } else {
            var tbox = rect.tbox();
            drawEvent.width = tbox.width;
            drawEvent.height = tbox.height;
            drawEvent.x = tbox.x;
            drawEvent.y = tbox.y;
        }
        drawEvent.type = tool;
        drawEvent.guid = clientGuid;
        drawEvent.color = color;


        socket.emit('drawingProgress', drawEvent);
	}
});

draw.on('mouseup', function(e){
    if (deleting) {
        return;
    }
	rect.draw('stop', e);

    drawEvent.objId = guid();
    rect.attr({objId: drawEvent.objId});

    if (tool == 'line') {
        var points = rect.array().value;
        drawEvent.x = points[0][0];
        drawEvent.y = points[0][1];
        drawEvent.x2 = points[1][0];
        drawEvent.y2 = points[1][1];
    }else if(tool == 'circle'){
        drawEvent.x = rect.cx();
        drawEvent.y = rect.cy();
        drawEvent.rx = rect.rx();
        drawEvent.ry = rect.ry();
    } else {
        var tbox = rect.tbox();
        drawEvent.width = tbox.width;
        drawEvent.height = tbox.height;
        drawEvent.x = tbox.x;
        drawEvent.y = tbox.y;
    }
    drawEvent.type = tool;
    drawEvent.guid = clientGuid;
    drawEvent.color = color;

    if (tool == 'text') {
        // Replace selecting box with text
        drawEvent.text = prompt("Text:");
        rect.replace(
            draw.text(drawEvent.text)
                .move(drawEvent.x, drawEvent.y)
                .fill(color)
        );
    }

    rect.click(clickHandler);

	socket.emit('drawing', drawEvent);

}, false);

draw.on('drawstop', function(){
	// remove listener
});

function drawObject(drawEvent){
    if(clientGuid != drawEvent.guid) {
        if(inProgressRectMap.has(drawEvent.guid)){
            inProgressRectMap.get(drawEvent.guid).remove();
            inProgressRectMap.delete(drawEvent.guid);
        }
        if (drawEvent.type == 'line') {
            draw.line(drawEvent.x, drawEvent.y, drawEvent.x2, drawEvent.y2)
                .stroke({ width: 1, color: drawEvent.color})
                .attr({objId: drawEvent.objId})
                .click(clickHandler);
        } else if (drawEvent.type == 'circle') {
            draw.circle(drawEvent.rx*2).move(drawEvent.x-drawEvent.rx, drawEvent.y-drawEvent.ry).fill(drawEvent.color)
            .attr({objId: drawEvent.objId});
        } else if (drawEvent.type == 'text') {
            draw.text(drawEvent.text)
                .move(drawEvent.x, drawEvent.y)
                .fill(color)
                .attr({objId: drawEvent.objId})
                .click(clickHandler);
        } else {
            draw.rect(drawEvent.width, drawEvent.height)
                .move(drawEvent.x, drawEvent.y)
                .fill(drawEvent.color)
                .attr({objId: drawEvent.objId})
                .click(clickHandler);
        }
    }
}

function drawObjectInProgress(drawEvent){
    if(clientGuid != drawEvent.guid) {
        if(!inProgressRectMap.has(drawEvent.guid)){
            if (drawEvent.type == 'line') {
                inProgressRectMap.set(drawEvent.guid, draw.line());
            }else if (drawEvent.type == 'circle') {
                inProgressRectMap.set(drawEvent.guid, draw.circle().move(drawEvent.x, drawEvent.y));
            } else {
                inProgressRectMap.set(drawEvent.guid, draw.rect());
            }

        }
        var svgObj = inProgressRectMap.get(drawEvent.guid);
        if (drawEvent.type == 'line') {
            svgObj.plot(drawEvent.x, drawEvent.y, drawEvent.x2, drawEvent.y2)
                .stroke({ width: 1, color: drawEvent.color });
        }else if (drawEvent.type == 'circle') {
            svgObj.radius(drawEvent.rx)
                .fill(drawEvent.color);
        } else if (drawEvent.type == 'text') {
            svgObj.width(drawEvent.width)
                .height(drawEvent.height)
                .move(drawEvent.x, drawEvent.y)
                .stroke({width: 1, color: drawEvent.color})
                .fill({opacity: 0.2, color: drawEvent.color});
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

function calculateTextSize(text, width, height) {
    var test = document.createTextNode(text);
    test.style.fontSize = fontSize;
    var height = (test.clientHeight + 1) + "px";
    var width = (test.clientWidth + 1) + "px";
}


function deleteDrawing(objId) {
    console.log("removing objId " + objId);
}

function clickHandler() {
    socket.emit('deleteDrawing', this.node.getAttribute("objId"));
}

function toggleDelete(elm) {
    deleting = !deleting;
    if (deleting) {
        $(elm).text("Stop");
    } else {
        $(elm).text("Delete");
    }
}