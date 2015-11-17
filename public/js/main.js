$(function(){
  var socket = io();
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    console.log('chat message');
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
    socket.on('drawing', function(msg){
      drawObject(msg);
    });

    socket.on('drawingProgress', function(msg){
      drawObjectInProgress(msg);
    });

    socket.on('clearDrawing', function(){
      clearDrawing();
    });

    socket.on('deleteDrawing', function(index){
      deleteDrawing(index);
    });
});


