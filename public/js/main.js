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
      $('#messages').append($('<li>').text(JSON.stringify(msg)));
      drawObject(msg);
    });
});
