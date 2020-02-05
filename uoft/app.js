var express = require('express');
var socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

const AWS = require('aws-sdk');

const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
};

const s3 = new AWS.S3(config);


var pram = {
    Bucket : 'image1213',
};
function seimg(val){
    s3.listObjects(pram, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        io.emit('img', data["Contents"][val]["Key"]);
      }
    });
}

io.on('connection', function(socket){
    console.log("connect");
    socket.on("reqimage", function (img) {
        console.log(img);
        seimg(img);
    });
});





