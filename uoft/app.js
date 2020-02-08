/// IMPORTS AND DUMB STUFF
var express = require('express');
var AWS = require('aws-sdk')
var path = require('path');
var fs = require('fs');
var atob = require('atob')

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// CONSTANTS AND API KEYS
const PORT = process.env.PORT || 3000;
const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-2"
};
const rek = new AWS.Rekognition(config)



// PAGE BUILDING STUFF
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

var publicPath = path.join(__dirname, 'public');

app.get('/sign-in', function (req, res) {
  res.sendFile(path.join(publicPath + '/done.html'));
});

server.listen(PORT);
console.log("CHECKING PORT " + PORT +"!")

//SOCKET IO STUFF
io.on('connection', function(socket){
    socket.on("fbbox", function (data) {
        var imgbyte = getBinary(data);
        var rekognitionRequest = {
          CollectionId: "thing",
          FaceMatchThreshold: 85, 
          Image: {
            Bytes: imgbyte
          },
          MaxFaces: 1
        };
        
        rek.searchFacesByImage(rekognitionRequest, function(err,data){
            if (err) console.log(err);
            else{
                var bbox = data["SearchedFaceBoundingBox"];
                console.log(bbox);
                io.emit("returnbbox", bbox)
            }
        });
        
    });
    console.log("USER CONNECTED")
});


function getBinary(base64Image) {
  var binaryImg = atob(base64Image);
  var length = binaryImg.length;
  var ab = new ArrayBuffer(length);
  var ua = new Uint8Array(ab);
  for (var i = 0; i < length; i++) {
    ua[i] = binaryImg.charCodeAt(i);
  }

  return ab;
}













