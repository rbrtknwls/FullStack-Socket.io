const AWS = require('aws-sdk');

var express = require('express');
var socketIO = require('socket.io');
var path = require('path');

const fs = require('fs');

const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-2"
};

const s3 = new AWS.S3(config);

const PORT = 3000;
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



var username = "shit";
var existsincol = 0;
var person_id = "";

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
function adtocol(id){
    rek.indexFaces({
      CollectionId: "thing", 
      DetectionAttributes: [
      ], 
      ExternalImageId: thin, 
      Image: {
       S3Object: {
        Bucket: "image1213", 
        Name: id
       }
      }
    }, function(err, data) {
        if (err) console.log("a");
        else{
            console.log("a");
        };
    });
}
function foundq(as){
    var match = as["FaceMatches"][0];
    person_id = match["Face"]["ExternalImageId"];
    
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
           existsincol = 1;
           
       }
       else{
           console.log("hap");
           existsincol = 2;
           foundq(data);
           
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
    },3000);
    
    setTimeout(function() {
        if (existsincol == 1){
            console.log("Cant Find in Col... ADDING IT NOW");
            
        }
        else if (existsincol == 2){
            console.log("Found in Col");
            console.log(person_id);
            //io.emit('fid', username);
        }
    },5500)
    
}












