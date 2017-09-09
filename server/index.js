var app = require('express')();
var fs = require('fs');

var httpsr = require('http');
// httpsr.globalAgent.options.rejectUnauthorized = false;

const options = {
  // key: fs.readFileSync('./key.pem'),
  // cert: fs.readFileSync('./cert.pem')
};

var https = httpsr.createServer(app);

var io = require('socket.io')(https);
var port = process.env.PORT || 3000;

var argv = require('yargs').argv;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/client', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket){
  console.log('connection');

  socket.on('data-rotation', function(msg){
    console.log(msg);
    io.emit('update-rotation', msg);
  });

  socket.on('data-position', function(msg){
    console.log(msg);
    io.emit('update-position', msg);
  });
});

https.listen(port, (argv.host || '192.168.1.19'), function(){
  console.log('listening on *:' + port);
});
