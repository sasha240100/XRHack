// Load required modules
var https   = require("https");                // http server core module
var express = require("express");           // web framework external module
var socketIo = require("socket.io");        // web socket external module
var easyrtc = require('./lib/easyrtc_server');               // EasyRTC external module
var fs      = require("fs");

https.globalAgent.options.rejectUnauthorized = false;
process.title = "node-easyrtc";

var app = express();
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/client', function(req, res){
    res.sendFile(__dirname + '/client.html');
});


app.get('/build/bundle.controller.js', function(req, res){
    res.sendFile(__dirname + '/build/bundle.controller.js');
});
app.get('/build/bundle.visual.js', function(req, res){
    res.sendFile(__dirname + '/build/bundle.visual.js');
});
app.get('/vendor/webvr-polyfill.min.js', function(req, res){
    res.sendFile(__dirname + '/vendor/webvr-polyfill.min.js');
});
app.get('/assets/controller.obj', function(req, res){
    res.sendFile(__dirname + '/assets/controller.obj');
});
app.get('/assets/controller.mtl', function(req, res){
    res.sendFile(__dirname + '/assets/controller.mtl');
});
app.get('/assets/tex/screen.png', function(req, res){
    res.sendFile(__dirname + '/assets/tex/screen.png');
});


var webServer = https.createServer({
    key:  fs.readFileSync("127.0.0.1.key"),
    cert: fs.readFileSync("127.0.0.1.crt")
}, app).listen(8443);

var socketServer = socketIo.listen(webServer, {"log level":1});

var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});