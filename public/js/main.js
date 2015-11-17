$(function () {
	var socket = io();

	socket.on('drawing', function (msg) {
		drawObject(msg);
	});

	socket.on('drawingProgress', function (msg) {
		drawObjectInProgress(msg);
	});

	socket.on('clearDrawing', function () {
		clearDrawing();
	});

	socket.on('deleteDrawing', function (objId) {
		deleteDrawing(objId);
	});
});


