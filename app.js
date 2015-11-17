var express = require('express');
var path = require('path');
var app = express();

 /* serves main page */
 app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
 });

 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]);
 });

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});