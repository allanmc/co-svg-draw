var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var drawEvents = new Map();

app.use(express.static('public'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));

io.on('connection',function(socket){
    console.log('Connected to socket');
    drawEvents.forEach((value, key) => {
        console.log('Emitting server events ' + key);
        io.emit('drawing', drawEvents.get(key));
    });

    socket.on('disconnect', function(){
        console.log('Disconnect to socket');
    });
    socket.on('drawing', function(msg){
    console.log('drawing ' + msg.objId);
        drawEvents.set(msg.objId, msg);
        io.emit('drawing', msg);
    });
    socket.on('drawingProgress', function(msg){
        io.emit('drawingProgress', msg);
    });
    socket.on('clearDrawing', function(){
        console.log('clearDrawing');
        drawEvents = new Map();
        io.emit('clearDrawing');
    });
    socket.on('deleteDrawing', function(objId){
        console.log('deleteDrawing: removing objId ' + objId);
        drawEvents.delete(objId);
        io.emit('deleteDrawing', objId);
    });
});

http.listen(80,function(){
  console.log('Example app listening at http://localhost:80');
});