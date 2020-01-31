var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var usernames = {};

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendfile('index.html');
});

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
                console.log(usernames[key]);
                io.emit('serv-so', usernames[key]);
            }
        }
        
        
        
    }, 16);
    
    socket.on('disconnect', function(){
        delete usernames[socket.id];
    });

});

