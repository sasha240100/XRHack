var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/client', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket){
  console.log('connection');

  socket.on('data', function(msg){
    console.log(msg);
    io.emit('update', msg);
  });
});

http.listen(port, '192.168.1.19', function(){
  console.log('listening on *:' + port);
});
