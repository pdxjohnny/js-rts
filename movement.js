function alternateCourse( object ){
	// Exicute travelToDestination until it returns true
	var origTheta = object.angle;
	var radius = object.ship.Image.width;
	for ( var origTheta = object.angle, theta = origTheta; theta < origTheta + 360; theta++ ) {
		var tempTheta = theta * (Math.PI/180);
		var path = {
			x: object.x + ( radius * Math.cos( tempTheta ) ),
			y: object.y + ( radius * Math.sin( tempTheta ) )
			};
		if ( travelToDestination( path, object ) ){
			found = true;
			break;
			}
		}
	if ( found ) {
		object.path = path;
		}
	else {
		delete object.des;
		}
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
	else if ( typeof traveler.path !== "undefined" ) {
		if ( inCords( { x: traveler.path.x - 4, y: traveler.path.y - 4 }, 
			{ x: traveler.path.x + 4, y: traveler.path.y + 4 },  traveler ) ){
				delete traveler.path;
				if( traveler.ship.Image.src.indexOf("moving") > -1 ) {
					traveler.ship.Image.src = traveler.ship.Image.src.replace(/moving.([^.]*)$/,'.'+'$1');
					}
				return true;
				}
			else return travelOnPath( traveler );
			}
	else if ( typeof traveler.y !== "undefined" &&
			typeof point.y !== "undefined" &&
			typeof traveler.x !== "undefined" &&
			typeof point.x !== "undefined" ) {
		return travelToDestination(point, traveler);
		}
	else return false;
	}

function travelOnPath( traveler ) {
	var res = travelToDestination( traveler.path, traveler );
	if ( res )  return true;
	else {
		delete traveler.path;
		return false;
		}
	}

function travelToDestination( point, traveler ) {
	if( traveler.ship.Image.src.indexOf("moving") < 0 ) {
		traveler.ship.Image.src = traveler.ship.Image.src.replace(/.([^.]*)$/,'moving.'+'$1');
		}
	var deltx = point.x - traveler.x;
	var delty = point.y - traveler.y;
	var theta = Math.atan( delty/deltx );
	traveler.angle = theta * (180/Math.PI);
	var yspeed = traveler.ship.stats.speed * Math.sin( theta );
	var xspeed = traveler.ship.stats.speed * Math.cos( theta );
	var newPosition = {
		x: traveler.x,
		y: traveler.y
		};
	if ( point.x >= traveler.x ) {
		newPosition.x += xspeed * modifier;
		newPosition.y += yspeed * modifier;
		}
	else if ( point.x <= traveler.x ){
		newPosition.x -= xspeed * modifier;
		newPosition.y -= yspeed * modifier;
		traveler.angle += 180;
		}
	newPosition.ship = traveler.ship;
	var noCollision = true;
	for ( var i in game.playersL ){
		if ( overlaping( game.playersL[i], newPosition ) ) noCollision = false;
		}
	for ( var i in game.structuresL ){
	//	if ( overlaping( game.structuresL[i], newPosition ) ) noCollision = false;
		}
	for ( var i in meL.units ){
		if ( meL.units[i].aid != traveler.aid ) {
			if ( overlaping( meL.units[i], newPosition ) ) noCollision = false;
			}
		}
	if ( noCollision ) {
		traveler.x = newPosition.x;
		traveler.y = newPosition.y;
		return traveler.angle;
		}
	else return false;
	}
