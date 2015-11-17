var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));

io.on('connection',function(socket){
    console.log('Connected to socket');
    socket.on('disconnect', function(){
        console.log('Disconnect to socket');
    });
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(80,function(){
    console.log('Example app listening at http://localhost:80');
});