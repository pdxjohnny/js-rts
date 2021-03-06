// Background image
var bg = new Object;
bg.Ready = false;
bg.Image = new Image();
bg.Image.onload = function () {
	bg.Ready = true;
	};
bg.Image.src = "images/stars1.png";

// Handle keyboard controls
// meL.keysDown = {};

addEventListener("keydown", function (e) {
	meL.keysDown[e.keyCode] = true;
	}, false);

addEventListener("keyup", function (e) {
	delete meL.keysDown[e.keyCode];
	}, false);

function singleSelect(evt) {
	var mouseAt = getMousePos(evt);
	var none = true;
	for ( var i in meL.units ){
		if ( onCords( mouseAt, meL.units[i] ) ) {
			if ( meL.units[i].selected ) {
				meL.units[i].selected = false;
				meL.units[i].des = {};
				if ( typeof meL.units[i].ship.options !== "undefined" )
					meL.units[i].ship.options();
				}
			else if ( none ) {
				meL.units[i].selected = true;
				if ( typeof meL.units[i].ship.options !== "undefined" )
					meL.units[i].ship.options();
				none = false;
				}
			}
		}
	if ( none ) {
		var atLeastOne = false;
		for ( var i in meL.units ){
			if ( meL.units[i].selected ) atLeastOne = true;
			}
		if ( atLeastOne ) {
			meL.des = mouseAt;
			for ( var i in meL.units ){
				if ( meL.units[i].selected && 
					typeof meL.des.x !== "undefined" &&
					typeof meL.des.y !== "undefined" ) {
					meL.units[i].des = {};
					meL.units[i].des.x = meL.des.x;
					meL.units[i].des.y = meL.des.y;
					delete meL.units[i].path;
					}
				}
			}
		else meL.des = {};
		}
	displaySelected();
	}

function selectStructure(evt) {
	var mouseAt = getMousePos(evt);
	var none = true;
	for ( var i in game.structuresL ){
		if ( onCords( mouseAt, game.structuresL[i] ) ) {
			if ( game.structuresL[i].selected ) {
				game.structuresL[i].selected = false;
				$('#bottomLeft').html("");
				}
			else if ( none ) {
				game.structuresL[i].selected = true;
				game.structuresL[i].ship.options();
				none = false;
				}
			}
		}
	if ( none ) {
		for ( var i in game.structuresL ){
			game.structuresL[i].selected = false;
			}
		//for ( var i in meL.units ){
			//meL.units[i].selected = false;
		//	}
		}
	displaySelected();
	}

function unselectAll() {
	for ( var i in meL.units ){
		meL.units[i].selected = false;
		}
	for ( var i in game.structuresL ){
		game.structuresL[i].selected = false;
		}
	meL.des = {};
	$('#bottomLeft').html("");
	displaySelected();
	}

function multiSelect(e){
	meL.selectBoxStart = getMousePos(e);
	$(canvas).mousemove(function(e){
		meL.selectBoxEnd = getMousePos(e);
		});
	$(canvas).mouseup(function(e){
		for ( var i in meL.units ){
			if ( inCords( meL.selectBoxStart, meL.selectBoxEnd, meL.units[i] ) ) {
				if ( meL.units[i].selected ) {
					meL.units[i].des = {};
					}
				else {
					meL.units[i].selected = true;
					delete meL.units[i].path;
					}
				}
			}
		displaySelected();
		meL.selectBoxStart = false;
		meL.selectBoxEnd = false;
		return false; 
		});
	}

$(canvas).mousedown(function(e){
	switch (e.which) {
		case 1:
			$('#bottomLeft').html("");
			singleSelect(e);
			multiSelect(e);
			selectStructure(e);
			break;
		case 2:
			console.log('Middle Mouse button pressed.');
			break;
		case 3:
			unselectAll();
			break;
		default:
			console.log('You have a strange Mouse!');
		}
	});

function getMousePos(e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    else {
      x = e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop;
    }
	return {
		x: x,
		y: y
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

	// Move my occuoied object
	if ( meL.occupied ) objectShift( meL.occupied, modifier );

	// Apply my shift on my units
	for ( var i in meL.units ){
		if ( meL.occupied ) {
			if ( meL.occupied.aid !== meL.units[i].aid ) 
				playerShift( meL.units[i], modifier );
			}
		else {
			objectShift( meL.units[i], modifier );
			playerShift( meL.units[i], modifier );
			}
		}

	// Apply my shift on other objects
	for ( var i in game.playersL ){
		playerShift( game.playersL[i], modifier );
		}
	for ( var i in game.structuresL ){
		playerShift( game.structuresL[i], modifier );
		}
	for ( var i in game.opponents ){
		playerShift( game.opponents[i], modifier );
		}

	// Move the other players based on their keys
	for ( var i in game.playersL ){
		objectShift( game.playersL[i], modifier );
		}
	for ( var i in game.opponents ){
		objectShift( game.opponents[i], modifier );
		}
	}

function onCords( cords, object ){
	if ( typeof cords.x !== "undefined" && typeof cords.y !== "undefined" &&
		typeof object.x !== "undefined" && typeof object.y !== "undefined" &&
		typeof object.ship !== "undefined" ) {
		if ( cords.x >= (object.x - object.ship.Image.width/2) &&
			cords.x <= (object.x + object.ship.Image.width/2) &&
			cords.y >= (object.y - object.ship.Image.height/2) &&
			cords.y <= (object.y + object.ship.Image.height/2) ) {
				return true;
			}
		}
	else return false;
	}

function overlaping( objectOne, objectTwo ){
	if ( typeof objectOne.x !== "undefined" && typeof objectOne.y !== "undefined" &&
		typeof objectTwo.x !== "undefined" && typeof objectTwo.y !== "undefined" &&
		typeof objectOne.ship !== "undefined" &&
		typeof objectTwo.ship !== "undefined" ) {
		objectOne.topLeft = {
			x: (objectOne.x - objectOne.ship.Image.width/2),
			y: (objectOne.y - objectOne.ship.Image.height/2)
			};
		objectOne.bottomRight = {
			x: (objectOne.x + objectOne.ship.Image.width/2),
			y: (objectOne.y + objectOne.ship.Image.height/2)
			};
		if ( inCords( objectOne.topLeft, objectOne.bottomRight, objectTwo ) ) {
			return true;
			}
		}
	else return false;
	}

function inCords( start, end, object ){
	if ( typeof start.x !== "undefined" && typeof start.y !== "undefined" &&
		typeof end.x !== "undefined" && typeof end.y !== "undefined" &&
		typeof object.x !== "undefined" && typeof object.y !== "undefined" &&
		typeof object.ship !== "undefined" ) {
		if ( end.x < start.x && end.y < start.y ) return inCords( end, start, object );
		else if ( end.x > start.x && end.y < start.y ) {
			var temp = start.x;
			start.x = end.x;
			end.x = temp;
			return inCords( start, end, object );
			}
		else if ( end.x < start.x && end.y > start.y ) {
			var temp = start.y;
			start.y = end.y;
			end.y = temp;
			return inCords( start, end, object );
			}
		else if ( ( start.x <= (object.x - object.ship.Image.width/2) &&
			start.y <= (object.y - object.ship.Image.height/2) &&
			end.x >= (object.x + object.ship.Image.width/2) &&
			end.y >= (object.y + object.ship.Image.height/2) ) ||
			( start.x <= object.x &&
			start.y <= object.y &&
			end.x >= object.x &&
			end.y >= object.y ) ) {
				return true;
			}
		}
	else return false;
	}

function playerShift( object, modifier ){
	if ( Object.keys(meL.keysDown).length > 0 ) {
		if ( 38 in meL.keysDown || 87 in meL.keysDown ) { // Player holding up
			object.y += meL.speed * modifier;
			}
		if ( 40 in meL.keysDown || 83 in meL.keysDown ) { // Player holding down
			object.y -= meL.speed * modifier;
			}
		if ( 37 in meL.keysDown || 65 in meL.keysDown ) { // Player holding left
			object.x += meL.speed * modifier;
			}
		if ( 39 in meL.keysDown || 68 in meL.keysDown ) { // Player holding right
			object.x -= meL.speed * modifier;
			}
		if ( typeof object.des !== "undefined" ) {
			if ( typeof object.des.x !== "undefined" &&
				typeof object.des.y !== "undefined" ) {
				playerShift( object.des, modifier );
				}
			}
		if ( typeof object.path !== "undefined" ) {
			if ( typeof object.path.x !== "undefined" &&
				typeof object.path.y !== "undefined" ) {
				playerShift( object.path, modifier );
				}
			}
		return true;
		}
	else return false;
	}

function objectShift( object, modifier ) {
	object.ai();
	if ( typeof object.des !== "undefined" ) {
		if ( typeof object.des.x !== "undefined" && typeof object.des.y !== "undefined" ) {
			object.travel();
			}
		}
	else {
		if ( 38 in object.keysDown || 87 in object.keysDown ) { // Player holding up
			object.y -= object.speed * modifier;
			}
		if ( 40 in object.keysDown || 83 in object.keysDown ) { // Player holding down
			object.y += object.speed * modifier;
			}
		if ( 37 in object.keysDown || 65 in object.keysDown ) { // Player holding left
			object.x += object.speed * modifier;
			}
		if ( 39 in object.keysDown || 68 in object.keysDown ) { // Player holding right
			object.x -= object.speed * modifier;
			}
		}
	}

// Draw everything
function render() {

	ctx.fillStyle="#2C2C2C";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if ( meL.selectBoxStart && meL.selectBoxEnd ) {
		ctx.globalAlpha=0.2;
		ctx.fillStyle="#33CC33";
		ctx.fillRect(meL.selectBoxStart.x, meL.selectBoxStart.y, 
			meL.selectBoxEnd.x-meL.selectBoxStart.x, 
			meL.selectBoxEnd.y-meL.selectBoxStart.y);
		ctx.globalAlpha=1;
		}

	ctx.fillStyle = "white";
	ctx.font = "10px Helvetica";
	for ( var i in meL.units ){
		var unit = meL.units[i];
		if ( Object.keys( unit.keysDown ).length > 0 ) unit.angle = angleOf(unit);
		if ( unit.ship.Image.Ready ) {
			if ( unit.aid === meL.occupied.aid ) {
				drawRotatedImage( unit.ship.Image, canvas.width/2, 
					canvas.height/2, unit.angle );
				ctx.fillText(unit.username.un, canvas.width/2, canvas.height/2);
				}
			else {
				drawRotatedImage( unit.ship.Image, unit.x, unit.y, unit.angle );
				ctx.fillText(unit.username.un, unit.x-25, unit.y-25 );
				}
			if ( unit.selected ) {
				drawRotatedRect( unit, "#33CC33" );
				}
			if ( unit.target ) {
				drawRotatedRect( unit.target, "red" );
				}
			}	
		}
	for ( var i in game.opponents ){
		var op = game.opponents[i];
		if ( op.ship.Image.Ready ) {
			drawRotatedImage( op.ship.Image, op.x, op.y, op.angle ); 
			ctx.fillStyle = 'red';
			ctx.fillText(op.username.un, op.x-25, op.y-25 );
			if ( op.target ) {
				drawRotatedRect( op.target, "yellow" );
				}
			}
		}
	for ( var i in game.weapons ){
		var weapon = game.weapons[i];
		if ( weapon.ship.Image.Ready ) {
			drawRotatedImage( weapon.ship.Image, weapon.x, weapon.y, weapon.angle ); 
			}
		}
	for ( var i in game.structuresL ){
		var struct = game.structuresL[i];
		if ( struct.ship.Image.Ready ) {
			drawRotatedImage( struct.ship.Image, struct.x, struct.y, struct.angle );  
			ctx.fillStyle = '#33CC33';
			ctx.fillText(struct.username, struct.x-25, struct.y-25 );
			if ( struct.selected ) {
				drawRotatedRect( struct, "#33CC33" );
				}
			}
		}
	for ( var i in game.playersL ){
		var player = game.playersL[i];
		if ( player.ship.Image.Ready ) {
			drawRotatedImage( player.ship.Image, player.x, player.y, player.angle ); 
			ctx.fillText(player.username, player.x-25, player.y-25 );
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
		modifier = delta / 1000;

		update(modifier);
		render();
		opponents.chance();
	
		then = now;
	
		if( socket ) {
			if( JSON.stringify(meL.keysDown) !== JSON.stringify(meS.keysDown) ) {
				meS = new LocalObjecttoSever( meL );
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

function drawRotatedRect( object, color ) {
	ctx.save(); 
	//ctx.rotate( object.angle );
	ctx.beginPath();
	ctx.rect(object.x-object.ship.Image.width/2, object.y-object.ship.Image.height/2, 
		object.ship.Image.width, object.ship.Image.height );
	ctx.lineWidth = 1;
	ctx.strokeStyle = color;
	ctx.stroke();
	ctx.restore(); 
	}

// Cross-browser support for requestAnimationFrameL
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
