function displaySelected(){
	var found = false;
	var units = [];
	for ( var i in meL.units ){
		var unit = meL.units[i];
		// <a href='#' onclick='meL.occupy("+unit.aid+")'>"+shipName+"</a>
		if ( unit.selected ) {
			units.push( unit.ship.shipName+" is at ("
				+Math.round(unit.x)+","+Math.round(unit.y)+")<br>" );
			found = true;
			}
		}
	if ( found ){
		$('#topRight').html("Selected units:<br>");
		for ( var i in units ){
			$('#topRight').append( units[i] );
			}
		}
	else $('#topRight').html("");
	}

function displayOccupied(){
	if ( meL.occupied ) {
		$('#bottomLeft').html("Occupied unit:<br>");
		$('#bottomLeft').append("Unit <a href='#' onclick='meL.unoccupy()'>"
			+meL.occupied.ship.shipName+"</a> is at ("
			+Math.round(meL.occupied.x)+","+Math.round(meL.occupied.y)+")<br>");
		}
	else $('#bottomLeft').html("");
	}
