var app = require('express')();
var http = require('http').createServer(app);

http.listen(8033, function(){
  console.log('listening on *:8033');
});

var io = require('socket.io')(http);

const users = {}
const colors = {}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  socket.on('new-user', name => {
	  users[socket.id] = name
	  //random font color for each user 'logged' in
	  var letters = '23456789ABCD';
	  var color = '#';
	  for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 12)];
	  }
	  colors[socket.id] = color
	  //message announcing new user
	  io.emit('chat message', colors[socket.id] + '~;~;!' + users[socket.id] + " CONNECTED");
  })
  socket.on('chat message', function(msg){
    io.emit('chat message', colors[socket.id] + '~;~;!' + users[socket.id] + ": " + msg);
  });
  socket.on('disconnect', () => {
	  if (users[socket.id] != null) {
		socket.emit('chat message', users[socket.id] + " DISCONNECTED");
		delete users[socket.id]
	  }
	  else {
		socket.emit('chat message', "SOMEONE DISCONNECTED");
	  }
  })
  
})