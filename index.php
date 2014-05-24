<head>
	<meta charset="utf-8">
	<title>Game</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="http://pdxjohnny.tk:443/socket.io/socket.io.js"></script>
</head>


My id: <span id="myId"></span><br>
Users connected: <span id="usersConnected"></span><br>
<button onclick=" game.running = false; " >Pause</button>
<button onclick=" game.running = true; " >Play</button>
<form id="myUsername" action="" >
	My Username: 
	<input id="name" type="text" ></input>
</form>
players:<br>
<div id="players" ></div> 
<canvas id="gameWindow" ></canvas>

<script>
var socket = io.connect('http://pdxjohnny.tk:443');
var game = new Object;
var meL = new localPlayer( 0, "", 0, 0, "images/hero.png" );
var meS;
game.playersL = [];
game.playersS = [];

$(document).ready(function(){
 
	// Display user count on page
	socket.on('users connected', function(number){
		$('#usersConnected').html(number);
		});

	// What's my id
	socket.on('your id', function(id){
		meL.id = id;
		$('#myId').html(id);
		});
 
	// Players sent from server
	socket.on('players', function(players){
		game.playersS = players;
		var deleted = deletePlayer( meL.id, game.playersS );
		if ( deleted ) game.playersS = deleted;
		game.playersL = [];
		for ( var i in game.playersS ){
			var player = game.playersS[i];
			game.playersL.push( ServertoLocal( player ) );
			}
		$('#players').html("");
		for ( var i in players ){
			$('#players').append( "User: " + players[i].username + " is at ("+players[i].x+","+players[i].y+")<br>" );
			}
		});
 
	// Player updated on server
	socket.on('update player', function(player){
		// game.playersS = players;
		if ( player.id !== meL.id ){
			player = ServertoLocal( player );
			updatePlayerLocal( player );
			$('#players').html("");
			for ( var i in game.playersL ){
				$('#players').append( "User: " + game.playersL[i].username + " is at ("+game.playersL[i].x+","+game.playersL[i].y+")<br>" );
				}
			}
		});
	});

$('#myUsername').on("submit", function (e) {
	e.preventDefault();
	meL.username = $('#name').val();
	meL.Ready = false;
	meL.Image = new Image();
	meL.Image.onload = function () {
		meL.Ready = true;
		};
	meL.Image.src = meL.pic;
	then = Date.now();
	reset();
	game.main();
	game.running = true;
	meS = new LocaltoSever( meL );
	socket.emit('update player', meS );
	return false;
	});

function localPlayer( id, username, x, y, image ){
	this.id = id;
	this.username = username;
	this.x = x;
	this.y = y;
	this.pic = image;
	this.speed = 256;
	this.keysDown = {};
	this.Ready = false;
	this.Image = new Image();
	this.Image.onload = function () {
		this.Ready = true;
		};
	this.Image.src = this.pic;
	}

function serverPlayer( id, username, x, y, image ){
	this.id = id;
	this.username = username;
	this.x = x;
	this.y = y;
	this.speed = 256;
	this.pic = image;
	}

function LocaltoSever( local ){
	this.id = local.id;
	this.username = local.username;
	this.x = local.x;
	this.y = local.y;
	this.speed = local.speed;
	this.keysDown = {};
	for ( var i in local.keysDown ) {
		this.keysDown[i] = true;
		}
	this.pic = local.pic;
	}

function ServertoLocal( server ){
	var local = new Object;
	local.id = server.id;
	local.username = server.username;
	local.x = server.x;
	local.y = server.y;
	local.pic = server.pic;
	local.speed = 256;
	local.keysDown = server.keysDown;
	local.Ready = false;
	local.Image = new Image();
	local.Image.onload = function () {
		local.Ready = true;
		};
	local.Image.src = local.pic;
	return local;
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

function updatePlayerLocal( player ){
	var updated = false;
	for ( var i in game.playersL ){
		if ( game.playersL[i].id === player.id ) {
			game.playersL[i] = player;
			updated = true;
			break;
			}
		}
	if ( updated ) return true;
	else {
		game.playersL.push(player);
		return false;
		}
	}

</script>
<script src="gameclient.js"></script>
