var app = require('express')();
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
});
