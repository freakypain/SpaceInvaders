var http = require('http');
var express = require('express');
var io = require('socket.io');

var app = express();
var server = http.createServer(app);
io = require('socket.io').listen(server);

// Configuration
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

// List of connected players's hash
var tab_pl = [];
var i = 0;

// No More log files
io.set('log level', 1);

// socket.io
io.sockets.on('connection', function(socket){
  socket.on('client_connected', function (data){
  	data.id = socket.id;
    tab_pl[i] = data;
    socket.player = tab_pl[i];
    i++;
    //console.log(tab_pl);
    socket.emit('get_all_players', tab_pl);
    socket.emit('id_player', socket.id);
    socket.broadcast.emit('new_player', data);
  });  
  
  socket.on('move_player',function(data){
  	for(var p = 0; p < tab_pl.length; p++){
  		if(tab_pl[p].id == data.id){
  			tab_pl[p] = data;
  		}
  	}
  	socket.broadcast.emit('move_the_player', data);
  });
  
  socket.on('game_start', function(data){
  	socket.broadcast.emit('start_the_game');
  });
  
  socket.on('disconnect', function () {
    var j = 0;
    var n = 0;
    var tmp = [];

    while (n < tab_pl.length){
    	if (tab_pl[j].id == socket.id){n++;}
			if (n < tab_pl.length) {
	  	    tmp[j] = tab_pl[n];
	  	    j++;
	  		n++;
	  	}
		}
	tab_pl = tmp;
	i = j;
	socket.broadcast.emit('get_all_players', tab_pl);
  });
});

server.listen(8000);
console.log("Server working on http://localhost:8000");