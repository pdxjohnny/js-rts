// Background image
var bg = new Object;
bg.Ready = false;
bg.Image = new Image();
bg.Image.onload = function () {
	bg.Ready = true;
	};
bg.Image.src = "images/stars1.png";

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

canvas.addEventListener('click', function(evt) {
	meL.des = getMousePos(canvas, evt);
	console.log(meL.des.x, meL.des.y);
	//if ( collision( meL.des,  )
	}, false);

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
		};
	}

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
		meL.y -= meL.ship.stats.speed * modifier;
		}
	if ( 40 in meL.keysDown || 83 in meL.keysDown ) { // Player holding down
		meL.y += meL.ship.stats.speed * modifier;
		}
	if ( 37 in meL.keysDown || 65 in meL.keysDown ) { // Player holding left
		meL.x -= meL.ship.stats.speed * modifier;
		}
	if ( 39 in meL.keysDown || 68 in meL.keysDown ) { // Player holding right
		meL.x += meL.ship.stats.speed * modifier;
		}

	// Apply my shift on other objects
	for ( var i in game.playersL ){
		var player = game.playersL[i];
		if ( 38 in meL.keysDown || 87 in meL.keysDown ) { // Player holding up
			player.y += meL.ship.stats.speed * modifier;
			}
		if ( 40 in meL.keysDown || 83 in meL.keysDown ) { // Player holding down
			player.y -= meL.ship.stats.speed * modifier;
			}
		if ( 37 in meL.keysDown || 65 in meL.keysDown ) { // Player holding left
			player.x += meL.ship.stats.speed * modifier;
			}
		if ( 39 in meL.keysDown || 68 in meL.keysDown ) { // Player holding right
			player.x -= meL.ship.stats.speed * modifier;
			}
		}

	// Move the other players based on their keys
	for ( var i in game.playersL ){
		var player = game.playersL[i];
		if ( 38 in player.keysDown || 87 in player.keysDown ) { // Player holding up
			player.y -= player.ship.stats.speed * modifier;
			}
		if ( 40 in player.keysDown || 83 in player.keysDown ) { // Player holding down
			player.y += player.ship.stats.speed * modifier;
			}
		if ( 37 in player.keysDown || 65 in player.keysDown ) { // Player holding left
			player.x -= player.ship.stats.speed * modifier;
			}
		if ( 39 in player.keysDown || 68 in player.keysDown ) { // Player holding right
			player.x += player.ship.stats.speed * modifier;
			}
		}

	// Are they touching?
/*	if ( meL.x <= (monster.x + 32) &&
		monster.x <= (meL.x + 32) &&
		meL.y <= (monster.y + 32) &&
		monster.y <= (meL.y + 32) ) {
			monstersCaught++;
			reset();
			}
*/	};

// Draw everything
function render() {
	if (bg.Ready) {
		ctx.fillStyle="#2C2C2C";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

	ctx.fillStyle = "white";
	ctx.font = "10px Helvetica";
	if (meL.ship.Image.Ready) {
		drawRotatedImage( meL.ship.Image, canvas.width/2, canvas.height/2 , angleOf(meL) ); 
		ctx.fillText(meL.username, (canvas.width/2)-25, (canvas.height/2)-25);
		}

	for ( var i in game.playersL ){
		var player = game.playersL[i];
		if ( player.ship.Image.Ready ) {
			drawRotatedImage( player.ship.Image, player.x, player.y, angleOf(player) ); 
			ctx.fillText(player.username, player.x-25, player.y-25);
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
