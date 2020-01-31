var express = require('express');
var socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

usernames = {}

function disname(dic){
    console.log("--- nit ---")
    for (var key in dic){
        console.log(key +":" +dic[key])
    }
}
    
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

io.on('connection', function(socket){

    console.log('Yay, connection was recorded')
    
    socket.on("soserv", function (id,inx,iny) {
        if (id != null && !(id in usernames)){
            var n = getRandomColor()
            usernames[id] = [inx, iny, n];
        }
        if (id != null){
            usernames[id] = [inx, iny, usernames[id][2]];
        }
        
    });
    
    setInterval(function(){ 
        
        for (var key in usernames) {
            // check if the property/key is defined in the object itself, not in parent
            if (usernames.hasOwnProperty(key)) {     
                io.emit('serv-so', usernames);
            }
        }
        
        
        
    }, 16);
    
    socket.on('disconnect', function(){
        delete usernames[socket.id];
    });

});

