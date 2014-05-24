// Let’s make node/socketio listen on port 443
var port = 443;
var io = require('socket.io').listen( port );
//var mysql = require("./mysql_functions.js");

// Define/initialize our global vars
var clients = {};
var players = [];
var messages = [];
var socketCount = 0;

io.sockets.on('connection', function(socket){
	// Socket has connected, increase socket count
	socketCount++;
	clients[socket.id] = socket;
	socket.emit('your id', socket.id);
	socket.emit('players', players);

	// Let all sockets know how many are connected
	io.sockets.emit('users connected', socketCount);

	socket.on('disconnect', function() {
		socketCount--;
		delete clients[socket.id];
		var deleted = deleteUndefined( clients );
		if ( deleted ) clients = deleted;
		deleted = deletePlayer( socket.id, players );
		if ( deleted ) players = deleted;
		io.sockets.emit('users connected', socketCount);
		io.sockets.emit('players', players);
		});

	// Update player data
	socket.on('update me', function( playerData ) {
		playerData.aid = players.length;
		var deleted = deletePlayer( socket.id, players );
		if ( deleted ) players = deleted;
		players.push(playerData);
		socket.broadcast.emit('update player', playerData);
		// io.sockets.emit('players', players);
		});

	// Send message
	socket.on('personal message', function( message ) {
		playerData.aid = players.length;
		var deleted = deletePlayer( socket.id, players );
		if ( deleted ) players = deleted;
		players.push(playerData);
		socket.broadcast.emit('update player', playerData);
		// io.sockets.emit('players', players);
		});

	});

function limit( array, limit ){
	var length = array.length;
	if ( length > limit ){
		var res = [];
		for ( var i = 0; length > limit; i++ ){
			delete array[i];
			length--;
			}
		res = deleteUndefined( array );
		return res;
		}
	else return false;
	}

function deletePlayer( sid, array ){
	var idWasDeleted = false;
	for ( var i = 0; i < array.length; i++ ){
		if ( array[i].id === sid ) {
			delete array[i];
			idWasDeleted = true;
			break;
			}
		}
	if ( idWasDeleted ){
		res = deleteUndefined( array );
		res = fixPlayerIds( res );
		return res;
		}
	else return false;
	}

function fixPlayerIds( array ){
	var res = [];
	for ( var i in array ){
		array[i].aid = i;
		res.push(array[i]);
		}
	return res;
	}

function deleteUndefined( array ){
	var res = [];
	for ( var i in array ){
		if( typeof array[i] !== "undefined" ) res.push(array[i]);
		}
	return res;
	}
