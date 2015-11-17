/* create an svg drawing */
var draw = SVG('drawing')
var socket = io();

/* draw rectangle */
var rect;
var inProgressRectMap = new Map();
var drawEvent={};
var guid = guid();
var color = '#66ccff';

function updateColor(picker) {
	color = picker.toHEXString();
}

draw.on('mousedown', function(e){
    rect = draw.rect().fill(color);
    rect.draw(e);
}, false);

draw.on('mousemove', function (e) {
	if (e.buttons == 1) {
        var tbox = rect.tbox();
        drawEvent.width = tbox.width;
        drawEvent.height = tbox.height;
        drawEvent.x = tbox.x;
        drawEvent.y = tbox.y;
        drawEvent.type = 'rect';
        drawEvent.guid = guid;
        drawEvent.color = color;

        socket.emit('drawingProgress', drawEvent);
	}
});

draw.on('mouseup', function(e){
	rect.draw('stop', e);

    var tbox = rect.tbox();
	drawEvent.width = tbox.width;
	drawEvent.height = tbox.height;
	drawEvent.x = tbox.x;
	drawEvent.y = tbox.y;
	drawEvent.type = 'rect';
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
        var rect = draw.rect(drawEvent.width,drawEvent.height).move(drawEvent.x,drawEvent.y).fill(drawEvent.color);
    }
}

function drawObjectInProgress(drawEvent){
    if(guid != drawEvent.guid) {
        if(!inProgressRectMap.has(drawEvent.guid)){
            inProgressRectMap.set(drawEvent.guid, draw.rect());
        }
        inProgressRectMap.get(drawEvent.guid)
        .width(drawEvent.width)
        .height(drawEvent.height)
        .move(drawEvent.x,drawEvent.y)
        .fill(drawEvent.color)
        .front();
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