var imagesnapjs = require('imagesnapjs');
var io = require('socket.io-client');
var ss = require('socket.io-stream');
var fs = require('fs-extra')

var socket = io.connect('http://localhost:3000/client');

socket.on('take_picture', function (data){
  var filename = './' + (new Date()).valueOf() + '.jpg';
  imagesnapjs.capture(filename, {cliflags: '-w 2'}, function(err) {
    
    var stream = fs.createReadStream(filename)
      .pipe(ss.createStream())
      .on('error', function(e){console.trace(e)});
    
    ss(socket).emit('result-image', stream, {name: filename});
    console.log(err ? err : 'Success!');
  });
});

socket.on('connect',    function (){ console.log('yay');  });
socket.on('disconnect', function (){ console.log('bye!'); });


