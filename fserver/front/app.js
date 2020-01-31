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
    

io.on('connection', function(socket){

    console.log('Yay, connection was recorded')
    
    socket.on('userset', function (uname, id) {
        usernames[id] = uname
        disname(usernames);
        
    });
    
    socket.on('msend', function (message, id) {
        if (id in usernames) io.emit("message", usernames[id] + ":" + message);
        else io.emit("message", "No_User_Set:" + message)
    });
    //handling disconnects
    socket.on('disconnect', function() {
       io.emit('chat message', 'some user disconnected');
    });

});

