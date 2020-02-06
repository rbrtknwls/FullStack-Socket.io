const AWS = require('aws-sdk');

var express = require('express');
var socketIO = require('socket.io');

const fs = require('fs');

const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-2"
};

const s3 = new AWS.S3(config);

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


const io = socketIO(server);


var username = "shit";


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
function addnewuser(){
    adtobucket("penis");
    
    setTimeout(function (){
        console.log("ass");
    },1000);
}
function adtobucket(name){
    username = name + "|" + Date.now() +".png";
    const params = {
      Bucket: "image1213",
      Key: username,
      Body: fs.readFileSync("b.png")
    };
    
    s3.putObject(params, function (err, data) {
      if (err) {
        console.log("Error: ", err);
      }
    });
    
}
function adtocol(_callback){
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
        if (err) console.log(err, err.stack); 
        else{
            _callback();
        };
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
        console.log(match);
        addnewuser();
    }
    
}

//STORE COLLECTION
function start(name){
    
    // ADD TO S3
    adtobucket(name)
    
    setInterval(function(){
        console.log(username);
    }, 100)
    /**
    rek.searchFacesByImage({
    CollectionId: "thing", 
      FaceMatchThreshold: 85, 
      Image: {
       S3Object: {
        Bucket: "image1213", 
        Name: "b.png"
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
    });**/
}


 
    
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





