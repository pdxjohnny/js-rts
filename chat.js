// Let’s make node/socketio listen on port 8000
var port = 8000;
var io = require('socket.io').listen( port );
//var mysql = require("./mysql_functions.js");

// Define/initialize our global vars
var clients = {};
var messages = [];
var socketCount = 0;

io.sockets.on('connection', function(socket){
	// Socket has connected, increase socket count
	socketCount++;
	clients[socket.id] = socket;
	io.sockets.emit('your id', socket.id);
	console.log(clients);

	// Let all sockets know how many are connected
	io.sockets.emit('users connected', socketCount);

	// Give them the messages
	io.sockets.emit('current messages', messages);

	socket.on('disconnect', function() {
		// Decrease the socket count on a disconnect, emit
		socketCount--;
		io.sockets.emit('users connected', socketCount);
		});

	socket.on('new message', function( newMessage ) {
		console.log( "We were sent a message containing : " + newMessage );
		messages.push( newMessage );
		var limited = limit( messages, 15 );
		if ( limited ) messages = limited;
		io.sockets.emit('current messages', messages);
		});

	});

function limit( array, limit ){
	var res = [];
	var length = array.length;
	if ( length > limit ){
		for ( var i = 0; length > limit; i++ ){
			delete array[i];
			length--;
			}
		for ( var i in array ){
			if( typeof array[i] !== undefined ) res.push(array[i]);
			}
		return res;
		}
	else return false;
	}
