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
    region: "us-east-2"
};

const s3 = new AWS.S3(config);
const rek = new AWS.Rekognition(config);

// FUNCTIONS
function deletecol(col){
    var params = {
        CollectionId: col
    };
    rek.deleteCollection(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
    });
}

function addcol(col){
    rek.createCollection({CollectionId: col}, function(err,data){
        if (err) console.log(err, err.stack);
    });
}

function entperson(thin){
    rek.indexFaces({
      CollectionId: "thing", 
      DetectionAttributes: [
      ], 
      ExternalImageId: thin, 
      Image: {
       S3Object: {
        Bucket: "image1213", 
        Name: "Funny-man.png"
       }
      }
    }, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);
    });
}
function foundq(as){
    var match = as["FaceMatches"][0];
    console.log(as);
    if (match == null){
        console.log("NO MATCH, REGISER");
        entperson("jack");

    }else{
        console.log("The matching ID is: " + match["Face"]["ExternalImageId"]);
    }
    
}

//STORE COLLECTION
function start(colnam){
    
    rek.searchFacesByImage({
    CollectionId: "thing", 
      FaceMatchThreshold: 95, 
      Image: {
       S3Object: {
        Bucket: "image1213", 
        Name: "Funny-man.png"
       }
      }, 
      MaxFaces: 1
    }, function(err, data) {
       if (err){
           console.log("not found");
           addcol("thing");
           rek.listCollections({}, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);  
           });
           start();
          
       }
       else{
           foundq(data);
       }
    });
}


 

rek.listCollections({}, function(err, data) {
if (err) console.log(err, err.stack); // an error occurred
else     console.log(data);    
});
    
start("thing");



// GET IMG URL
function seimg(val){
    s3.listObjects({Bucket: 'image1213'}, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        io.emit('img', data["Contents"][val]["Key"]);
      }
    });
}

io.on('connection', function(socket){
    socket.on("reqimage", function (img) {
        seimg(img);
    });
});





