<head>
	<meta charset="utf-8">
	<title>Game</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="objectConversions.js"></script>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>

<div style="position: absolute; left: 10px; top: 10px; width:200px; height:100px;">
        <canvas id="gameWindow" ></canvas>
</div>

<div id="topLeft" style="position: absolute; z-index: 1; left: 20px; top: 20px; background-color:rgba(0, 0, 0, 0.2); color: white;">

<form id="login" action="" >
	Username: <input id="name" type="text" ></input>
	<br>
<!--	Password: <input id="name" type="text" ></input>-->
</form>

players:<br>
<div id="players" ></div>

</div><div id="bottomLeft" style="position: absolute; z-index: 1; left: 20px; bottom: 20px; background-color:rgba(0, 0, 0, 0.2); color: white;">
</div>

<script>
// Globals
var game = new Object;
game.playersL = [];
game.playersS = [];
var meL = new localPlayer( 0, "", 0, 0, "images/shipblue.png" );
var meS;

// Create the canvas
var canvas = document.getElementById('gameWindow');
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// No Scroll
$("html").css("overflow", "hidden");
$("html").css("background-color", "#2C2C2C");

// Socket
var socket = false;
var socketId;
$.getScript( "http://pdxjohnny.tk:443/socket.io/socket.io.js" )
	.done(function( script, textStatus ) {
		
	socket = io.connect('http://pdxjohnny.tk:443');

	$.getScript( "gameclient.js" );

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
			$('#players').append( "User: " + players[i].username + " is at ("
				+Math.round(players[i].x)+","
				+Math.round(players[i].y)+")<br>" );
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
				$('#players').append( "User: " + game.playersL[i].username
				+" is at ("+Math.round(game.playersL[i].x)+","
				+Math.round(game.playersL[i].y)+")<br>" );
				}
			}
		});

		})
	.fail(function( jqxhr, settings, exception ) {
		socket = false;
	});

$('#login').on("submit", function (e) {
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

</script>
