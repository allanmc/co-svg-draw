/* create an svg drawing */
var draw = SVG('drawing');


/* draw rectangle */
var rect;
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
		// TODO emit e?
	}
});

draw.on('mouseup', function(e){
	rect.draw('stop', e);
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