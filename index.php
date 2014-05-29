<head>
	<meta charset="utf-8">
	<title>Game</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
	<script src="objectConversions.js"></script>
	<script src="ships.js"></script>
	<script src="shipStats.js"></script>
	<script src="ui.js"></script>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>

<div style="position: absolute;" oncontextmenu="return false;" >
        <canvas id="gameWindow" ></canvas>
</div>

<div id="topLeft" style="position: absolute; z-index: 1; left: 20px; top: 20px; background-color:rgba(0, 0, 0, 0.2); color: white;" oncontextmenu="return false;" >

<form id="login" action="" >
	Username: <input id="name" type="text" ></input>
	<br>
<!--	Password: <input id="name" type="text" ></input>-->
</form>

<div id="online" ></div>
</div>


<div id="topCenter" style="position: absolute; z-index: 1; left: 50%; margin: 0 auto; top: 20px; background-color:rgba(0, 0, 0, 0.2); color: white;" oncontextmenu="return false;" ></div>

<div id="topRight" style="position: absolute; z-index: 1; right: 20px; top: 20px; background-color:rgba(0, 0, 0, 0.2); color: white;" oncontextmenu="return false;" ></div>

<div id="bottomLeft" style="position: absolute; z-index: 1; left: 20px; bottom: 20px; background-color:rgba(0, 0, 0, 0.2); color: white;" oncontextmenu="return false;" ></div>

<div id="bottomRight" style="position: absolute; z-index: 1; right: 20px; bottom: 20px; background-color:rgba(0, 0, 0, 0.2); color: white;" oncontextmenu="return false;" ></div>

<script>
// Create the canvas
var canvas = document.getElementById('gameWindow');
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

$( window ).resize(function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	});

// Globals
var game = new Object;
game.playersL = [];
game.playersS = [];
game.structuresL = [ new localObject( 0, "merchant", 0, canvas.width/2, canvas.height/2, "images/structures/merchantBase.png", "merchantBase", "basic" ) ];
game.structuresS = [];
var meL = new player( 0, "", canvas.width/2, canvas.height/2, "images/shipblue.png" );
var meS;
var modifier;

// No Scroll
$("html").css("overflow", "hidden");
$("html").css("background-color", "#2C2C2C");

// Socket
var socket = false;
var socketId;
$.getScript( "http://pdxjohnny.tk:443/socket.io/socket.io.js" )
	.done(function( script, textStatus ) {
		
	socket = io.connect('http://pdxjohnny.tk:443');

	// $.getScript( "gameclient.js" );

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
			game.playersL.push( ServerObjecttoLocal( player ) );
			}
		$('#online').html("");
		for ( var i in players ){
			$('#online').append( "User: " + players[i].username + " is at ("
				+Math.round(players[i].x)+","
				+Math.round(players[i].y)+")<br>" );
			}
		});
 
	// Player updated on server
	socket.on('update player', function(player){
		// game.playersS = players;
		if ( player.id !== meL.id ){
			player = ServerObjecttoLocal( player );
			updatePlayerLocal( player );
			$('#online').html("Players:<br>");
			for ( var i in game.playersL ){
				$('#online').append( "User: " + game.playersL[i].username
				+" is at ("+Math.round(game.playersL[i].x)+","
				+Math.round(game.playersL[i].y)+")<br>" );
				}
			}
		});

		})
	.fail(function( jqxhr, settings, exception ) {
		$('#online').html("Multiplayer Server Offline");
		socket = false;
	});

$('#login').on("submit", function (e) {
	e.preventDefault();
	meL.username.un = $('#name').val();
	then = Date.now();
	game.main();
	game.running = true;
	displayFunds();
	for ( var i in meL.units ){
		var unit = meL.units[i];
		//socket.emit('update player', new LocalObjecttoSever( unit ) );	
		}
	$('#login').hide();
	return false;
	});

</script>
<script src="gameclient.js"></script>
