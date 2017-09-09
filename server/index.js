var app = require('express')();
<<<<<<< HEAD
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
  console.log('connection')
  socket.on('message', function(msg){
    console.log(msg);
    io.emit('message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
=======
var server = require('http').Server(app);


var Sequelize = require('sequelize');
var db = new Sequelize('sqlite://db.sqlite', {logging: false});
var models = require('./models')(db, Sequelize);

var Socket = require('./socket');

var port = process.env.GAME_PORT || 3000;

server.listen(port, function () {
    new Socket({
        models: models,
        room: 'crossover',
        namespace: '/game'
    })
    .run(server);

    console.log('Server is running...');
>>>>>>> ebc1b10122a7d665fddbe2d2abef93300ee51ce1
});
