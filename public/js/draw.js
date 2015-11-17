/* create an svg drawing */
var draw = SVG('drawing')

/* draw rectangle */
var rect = draw.rect(50,50).move(100,100).fill('#f09')

/* make rectangle jump and change color on mouse over */
rect.mouseover(function() {
	this.animate({duration: 500, ease: '<'})
		.move(400 * Math.random(), 400 * Math.random())
		.rotate(-45 + 90 * Math.random())
		.fill({
			r: ~~(Math.random() * 255)
			, g: ~~(Math.random() * 255)
			, b: ~~(Math.random() * 255)
		});
});

/* write text at the back */
draw.text('svg.js playground\ntry to grab the rectangle!')
	.back()
	.fill('#ccc')
	.move('50%', '40%')
	.font({
		family: 'Source Sans Pro'
		, size: 18
		, anchor: 'middle'
	});