var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var drawEvents = [];

app.use(express.static('public'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));

io.on('connection',function(socket){
    console.log('Connected to socket');
    for(var i in drawEvents){
        console.log('Emitting server events ' + i);
        io.emit('drawing', drawEvents[i]);
    };

    socket.on('disconnect', function(){
        console.log('Disconnect to socket');
    });
    socket.on('drawing', function(msg){
    console.log('drawing ' + msg.objId);
        drawEvents[msg.objId] = msg;
        io.emit('drawing', msg);
    });
    socket.on('drawingProgress', function(msg){
        io.emit('drawingProgress', msg);
    });
    socket.on('clearDrawing', function(){
        console.log('clearDrawing');
        drawEvents = [];
        io.emit('clearDrawing');
    });
    socket.on('deleteDrawing', function(objId){
        console.log('deleteDrawing: removing objId ' + objId);
        delete drawEvents[objId];
        io.emit('deleteDrawing', objId);
    });
});

http.listen(80,function(){
  console.log('Example app listening at http://localhost:80');
});