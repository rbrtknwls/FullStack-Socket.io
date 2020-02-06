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
var existsincol = 0;

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
      Body: fs.readFileSync("a.png")
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

function scol(id){
    rek.searchFacesByImage({
    CollectionId: "thing", 
      FaceMatchThreshold: 85, 
      Image: {
       S3Object: {
        Bucket: "image1213", 
        Name: id
       }
      }, 
      MaxFaces: 1
    }, function(err, data) {
       if (err){
           console.log(err);
           existsincol = 1;
           
       }
       else{
           existsincol = 2;
           
       }
    });
}

//STORE COLLECTION
function start(name){
    
    // ADD TO S3
    adtobucket(name)
    
    // NOTE IM NOT SURE HOW TO WAIT UNTIL FUNCTION IS COMPLETED... So we will use timeouts...
    setTimeout(function() {
        scol(username);
    },2000);
    
    setTimeout(function() {
        if (existsincol == 1){
            console.log("Cant Find in Col... ADDING IT NOW");
            
        }
        else if (existsincol == 2){
            console.log("Found in Col");
        }
    },3000)
    
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





