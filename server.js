const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io').listen(server)

// create an empty array
connections = [];
users = [];

server.listen(process.env.PORT || 7000, function(){
	console.log('server is running ')
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html')
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('connected: %s sockets connected', connections.length);

	// disconnections
	socket.on('disconnect', function(data){
		// if(!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnect: %s sockets connected.', connections.length)
	});

	//send message
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, user:socket.username});
	});

	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	})
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});