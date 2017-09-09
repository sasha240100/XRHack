// Load required modules
var https   = require("https");                // http server core module
var express = require("express");           // web framework external module
var socketIo = require("socket.io");        // web socket external module
var easyrtc = require('./lib/easyrtc_server');               // EasyRTC external module
var fs      = require("fs");

process.title = "node-easyrtc";

var app = express();
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/client', function(req, res){
    res.sendFile(__dirname + '/client.html');
  });
  
var webServer = https.createServer({
    key:  fs.readFileSync("domain.key"),
    cert: fs.readFileSync("domain.cert")
}, app).listen(8443);

var socketServer = socketIo.listen(webServer, {"log level":1});

var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});