var path = require('path');
var io = require('socket.io').listen(3000);
var ss = require('socket.io-stream');
var fs = require('fs-extra');
var keypress = require('keypress')(process.stdin);

Array.prototype.remove = function(elem) {
  var index = this.indexOf(elem);
  if (index > -1) this.splice(index, 1);
};

process.stdin.setRawMode(true);
process.stdin.resume();

var registered_sockets = []

process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }

  if (key && key.name == 'space') {
    registered_sockets.forEach(function(socket) {
      socket.emit('take_picture', { count: 1 });
    });
  }
});




io.of('/client').on('connection', function(socket) {
  registered_sockets.push(socket);

  ss(socket).on('result-image', function(stream, data) {
    var filename = path.basename(data.name);
    stream
      .pipe(fs.createWriteStream(filename + 'lol.jpg'))
      .on('error', function(e){console.trace(e)})
  });

  socket.on('disconnect', function(){
    registered_sockets.remove(socket);
  });
});



