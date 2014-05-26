// Create the canvas
var canvas = document.getElementById('gameWindow');
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

// Background image
var bg = new Object;
bg.Ready = false;
bg.Image = new Image();
bg.Image.onload = function () {
	bg.Ready = true;
	};
bg.Image.src = "images/background.png";
bg.angle = function( angle ){
	bg.Image.src = "images/background"+angle+".png";
	}

// GameL objects
var monstersCaught = 0;

var monster = {
	x: 0,
	y: 0
	};
monster.Ready = false;
monster.Image = new Image();
monster.Image.onload = function () {
	monster.Ready = true;
	};
monster.Image.src = "images/monster.png";

// Handle keyboard controls
// meL.keysDown = {};

addEventListener("keydown", function (e) {
	meL.keysDown[e.keyCode] = true;
	}, false);

addEventListener("keyup", function (e) {
	delete meL.keysDown[e.keyCode];
	}, false);

// Reset the gameL when the player catches a monster
function reset() {
	//meL.x = canvas.width / 2;
	//meL.y = canvas.height / 2;
	newMonster();
	};

function newMonster(){
	// Throw the monster someLwhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
	}

// Update game objects
function update(modifier) {
	// Move me
	if ( 38 in meL.keysDown || 87 in meL.keysDown ) { // Player holding up
		meL.y -= meL.speed * modifier;
		}
	if ( 40 in meL.keysDown || 83 in meL.keysDown ) { // Player holding down
		meL.y += meL.speed * modifier;
		}
	if ( 37 in meL.keysDown || 65 in meL.keysDown ) { // Player holding left
		meL.x -= meL.speed * modifier;
		}
	if ( 39 in meL.keysDown || 68 in meL.keysDown ) { // Player holding right
		meL.x += meL.speed * modifier;
		}

	// Apply my shift on other objects
	for ( var i in game.playersL ){
		var player = game.playersL[i];
		if ( 38 in meL.keysDown || 87 in meL.keysDown ) { // Player holding up
			player.y += meL.speed * modifier;
			}
		if ( 40 in meL.keysDown || 83 in meL.keysDown ) { // Player holding down
			player.y -= meL.speed * modifier;
			}
		if ( 37 in meL.keysDown || 65 in meL.keysDown ) { // Player holding left
			player.x += meL.speed * modifier;
			}
		if ( 39 in meL.keysDown || 68 in meL.keysDown ) { // Player holding right
			player.x -= meL.speed * modifier;
			}
		}

	// Move the other players based on their keys
	for ( var i in game.playersL ){
		var player = game.playersL[i];
		if ( 38 in player.keysDown || 87 in player.keysDown ) { // Player holding up
			player.y -= player.speed * modifier;
			}
		if ( 40 in player.keysDown || 83 in player.keysDown ) { // Player holding down
			player.y += player.speed * modifier;
			}
		if ( 37 in player.keysDown || 65 in player.keysDown ) { // Player holding left
			player.x -= player.speed * modifier;
			}
		if ( 39 in player.keysDown || 68 in player.keysDown ) { // Player holding right
			player.x += player.speed * modifier;
			}
		}

	// Are they touching?
	if ( meL.x <= (monster.x + 32) &&
		monster.x <= (meL.x + 32) &&
		meL.y <= (monster.y + 32) &&
		monster.y <= (meL.y + 32) ) {
			monstersCaught++;
			reset();
			}
	};

// Draw everything
var angle = angleOf(meL);
function render() {
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Monsters caught: " + monstersCaught, 32, 32);
	ctx.font = "10px Helvetica";

	if (bg.Ready) {
/*		if ( angle != angleOf(meL) ){
			angle = angleOf(meL);
			bg.angle( angle );
*/			ctx.drawImage(bg.Image, 0, 0);
//			}
		}

	if (meL.Ready) {
		//ctx.drawImage(meL.Image, canvas.width/2 , canvas.height/2 );
		drawRotatedImage( meL.Image, canvas.width/2, canvas.height/2 , angleOf(meL) ); 
		//ctx.fillText(meL.username, meL.x-5, meL.y-16);
		}

	if (monster.Ready) {
		//ctx.drawImage(monster.Image, monster.x, monster.y);
		}

	for ( var i in game.playersL ){
		var player = game.playersL[i];
		if ( player.Ready ) {
			//ctx.drawImage(player.Image, player.x, player.y);
			drawRotatedImage( player.Image, player.x, player.y, angleOf(player) ); 
			ctx.fillText(player.username, player.x-5, player.y-16);
			}	
		}
	};

// The main game loop
var then = 0;
game.running = false;
game.main = function() {
	if ( game.running ) {
		var now = Date.now();
		var delta = now - then;
	
		update(delta / 1000);
		render();
	
		then = now;
	
		if ( meS ) {
			if( JSON.stringify(meL.keysDown) !== JSON.stringify(meS.keysDown) ) {
				meS = new LocaltoSever( meL );
				socket.emit('update me', meS );
				}
			}
		}
	// Request to do this again ASAP
	requestAnimationFrame( game.main );
	};

// Turns server cordinates into local cordinates
function translate( object ) {
	object.x = canvas.width/2 - ( meL.x - object.x );
	object.y = canvas.height/2 - ( meL.y - object.y );
	}

// Chages the direction of the image
function angleOf( object ) {
	if ( ( 38 in object.keysDown || 87 in object.keysDown ) &&
		( 39 in object.keysDown || 68 in object.keysDown ) ) { // Player holding up and right
		return 315;
		}
	else if ( ( 38 in object.keysDown || 87 in object.keysDown ) &&
		( 37 in object.keysDown || 65 in object.keysDown ) ) { // Player holding up and left
		return 225;
		}
	else if ( ( 37 in object.keysDown || 65 in object.keysDown ) &&
		( 40 in object.keysDown || 83 in object.keysDown ) ) { // Player holding left and down
		return 135;
		}
	else if ( ( 40 in object.keysDown || 83 in object.keysDown ) &&
		( 39 in object.keysDown || 68 in object.keysDown ) ) {// Player holding down and right
		return 45;
		}
	else if ( 38 in object.keysDown || 87 in object.keysDown ) { // Player holding up
		return 270;
		}
	else if ( 40 in object.keysDown || 83 in object.keysDown ) { // Player holding down
		return 90;
		}
	else if ( 37 in object.keysDown || 65 in object.keysDown ) { // Player holding left
		return 180;
		}
	else return 0;
	}

// CSS for rotation
function drawRotatedImage(image, x, y, angle) { 
	// save the current co-ordinate system 
	// before we screw with it
	ctx.save(); 

	// move to the middle of where we want to draw our image
	ctx.translate(x, y);

	// rotate around that point, converting our 
	// angle from degrees to radians 
	ctx.rotate(angle * (Math.PI/180) );

	// draw it up and to the left by half the width
	// and height of the image 
	ctx.drawImage(image, -(image.width/2), -(image.height/2));

	// and restore the co-ords to how they were when we began
	ctx.restore(); 
	}

// Cross-browser support for requestAnimationFrameL
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
