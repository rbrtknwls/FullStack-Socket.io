var express = require('express');
var socketIO = require('socket.io');
var path = require('path');

const fs = require('fs');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

server = express();

server.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})
// other pages

var publicPath = path.join(__dirname, 'public');

server.get('/sign-in', function (req, res) {
  res.sendFile(path.join(publicPath + '/done.html'));
});

server.listen(PORT);










