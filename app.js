var express = require('express');
var path = require('path');
var io = require('socket.io');
var app = express();

app.use(express.static('public'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;
  io.listen(server);

  console.log('Example app listening at http://%s:%s', host, port);
});