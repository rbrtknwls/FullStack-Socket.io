/// IMPORTS AND PRE REQS
var express = require('express');
var AWS = require('aws-sdk')
var path = require('path');
var fs = require('fs');
var atob = require('atob')
var sslRedirect = require('heroku-ssl-redirect');

// CONSTANTS AND API KEYS
const PORT = process.env.PORT || 3000;
const config = {
    accessKeyId: ,
    secretAccessKey: ,
    region: "us-east-2"
};

// Instancate OBJECTS
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const rek = new AWS.Rekognition(config)




/* FORCE HTTPS 
|Reason|: video streaming lib only works over https
|Ref|: https://stackoverflow.com/questions/7185074/heroku-nodejs-http-to-https-ssl-forced-redirect */
app.use(sslRedirect());

// PAGE BUILDING STUFF
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/sign-in', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/done.html'));
});



server.listen(PORT);
console.log("CHECKING PORT " + PORT)


io.on('connection', function(socket){
    
    /* Recieve Image + Meta Data
    |Reason|: We need stringifyed data so that we can authenticate our users
    |Outcomes|: We will pass on the three outcomes found in our check functions sections*/
    socket.on("pass_server_image", function (img, date) {
        console.log("Begin func: pass_server_image");
        console.log(date);
        
    });
    console.log("USER CONNECTED")
});

// FUNCTIONS //

/* -- Image Processing Functions --
|Reason|: These functions should be for the first part of the authentication process, we want to stringfy the photo that we got from the socket and do our processes on that
|Outcomes|: NULL (No processing done with these functions)*/

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

/* -- Check Functions --
|Reason|: We want to compare the image that we currently have to a collection (which represents all authenticated users), to see if theres a match
|Outcomes|: 1) Image match in System -> Login
            2) Image match not in System -> Create Account
            3) Invalid Image -> Back to /sign_in*/

// 3
function datecomp (imgdate){
    console.log(imgdate);
}














