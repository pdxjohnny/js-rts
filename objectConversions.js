function player( id, username, x, y, image ){
	this.id = { id: id };
	this.username = { un: username };
	this.x = x;
	this.y = y;
	this.keysDown = {};
	this.des = {};
	this.units = [ new localObject( this.id, this.username, 0,
				x, y, "images/ships/fighterblue.png", "fighter", "basic" ) ];
	this.occupied = false; //this.units[0];
	this.occupy = function occupy( aid ){
		for ( var i in this.units ){
			if ( aid === this.units[i].aid ) this.occupied = this.units[i];
			}
		displayOccupied();
		};
	this.unoccupy = function unoccupy(){
		this.occupied = false;
		};
	this.speed = 256;
	this.centerOn = function centerOn( object ){
		travelTo( object, this, modifier, "jumpto" );
		};
	}

function localObject( id, username, aid, x, y, image, type, stats ){
	this.id = id;
	this.username = username;
	this.aid = aid;
	this.x = x;
	this.y = y;
	this.des = {};
	this.keysDown = {};
	this.des = {};
	this.angle = 0;
	this.traveling = true;
	this.travel = function travel(){
		var angle = travelTo( this.des, this );
		if ( angle >= 0 && angle <= 360 ) this.angle = angle;
		};
	this.selected = false;
	this.pic = image;
	this.ship = new getShip( aid, type, stats, this.pic );
	this.options = function options(){
		this.ship.options();
		};
	}

function serverPlayer( id, username, x, y, image ){
	this.id = id;
	this.username = username;
	this.x = x;
	this.y = y;
	this.speed = 256;
	this.pic = image;
	}

function LocalObjecttoSever( local ){
	this.id = local.id;
	this.username = local.username;
	this.x = local.x;
	this.y = local.y;
	this.pic = local.ship.Image.src;
	this.des = local.des;
	this.keysDown = {};
	for ( var i in local.keysDown ) {
		this.keysDown[i] = true;
		}
	this.direction = local.direction;
	this.ship = {
		shipName: local.ship.shipName,
		type: local.ship.type,
		stats: local.ship.stats,
		};
	}

function ServerObjecttoLocal( server ){
	var local = new Object;
	local.id = server.id;
	local.username = server.username;
	local.x = server.x;
	local.y = server.y;
	local.pic = server.pic;
	local.des = server.des;
	local.keysDown = server.keysDown;
	local.direction = server.direction;
	local.ship = new getShip( server.ship.shipName, server.ship.type,
				server.pic, server.ship.stats );
	//translate( local );
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

// Turns server cordinates into local cordinates
function translate( object ) {
	object.x = canvas.width/2 - ( meL.x - object.x );
	object.y = canvas.height/2 - ( meL.y - object.y );
	}

// Turns local cordinates into server cordinates
function reverseTranslate( object ) {
	object.x = canvas.width/2 + ( meL.x + object.x );
	object.y = canvas.height/2 + ( meL.y + object.y );
	}

function travelTo( point, traveler, special ){
	if ( special === "jumpto" ){
		traveler.x = point.x;
		traveler.y = point.y;
		return true;
		}
	else if ( inCords( { x: point.x - 4, y: point.y - 4 }, 
			{ x: point.x + 4, y: point.y + 4 },  traveler ) ){
				traveler.des = {};
				if( traveler.ship.Image.src.indexOf("moving") > -1 ) {
					traveler.ship.Image.src = traveler.ship.Image.src.replace(/moving.([^.]*)$/,'.'+'$1');
					}
				return true;
				}
	else if ( typeof traveler.y !== "undefined" &&
			typeof point.y !== "undefined" &&
			typeof traveler.x !== "undefined" &&
			typeof point.x !== "undefined" ) {
		if( traveler.ship.Image.src.indexOf("moving") < 0 ) {
			traveler.ship.Image.src = traveler.ship.Image.src.replace(/.([^.]*)$/,'moving.'+'$1');
			}
		var deltx = point.x - traveler.x;
		var delty = point.y - traveler.y;
		var theta = Math.atan( delty/deltx );
		traveler.angle = theta * (180/Math.PI);
		var yspeed = traveler.ship.stats.speed * Math.sin( theta );
		var xspeed = traveler.ship.stats.speed * Math.cos( theta );
		if ( point.x >= traveler.x ) {
			traveler.x += xspeed * modifier;
			traveler.y += yspeed * modifier;
			}
		else if ( point.x <= traveler.x ){
			traveler.x -= xspeed * modifier;
			traveler.y -= yspeed * modifier;
			traveler.angle += 180;
			}
		return traveler.angle;
		}
	else return false;
	}