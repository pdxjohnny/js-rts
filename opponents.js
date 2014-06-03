function newEnemy( name, x, y ){
	var image = opponents.createableTypes[name].image;
	var shipName = opponents.createableTypes[name].shipName;
	var stats = opponents.createableTypes[name].stats;
	var cost = opponents.createableTypes[name].cost;
	var rand = {
		x: canvas.width/2 + ( Math.random()*100 )*2,
		y: canvas.height/2 + ( Math.random()*100 )*2,
		};
	if ( 0.70 > Math.random() ) rand.x -= ( Math.random()*100 )*4;
	if ( 0.70 > Math.random() ) rand.y -= ( Math.random()*100 )*4;
	game.opponents.push( new localObject( null, { un: "Enemy" }, game.opponents.length,
		x, y, image, shipName, stats ) );
	game.opponents[game.opponents.length-1].des = rand;
	}

var opponents = {
	createableTypes: {
		"fighter": { image: "images/ships/fighterblue.png", shipName: "fighter", 
			stats: "basic", cost: 1000 },
		"cruser": { image: "images/ships/cruser.png", shipName: "cruser", 
			stats: "middle", cost: 3000 },
		"carrier": { image: "images/ships/carrier.png", shipName: "carrier", 
			stats: "advanced", cost: 10000 },
		},
	chance: function chance(){
		var chance = 0;
		if ( game.opponents.length <= 0 ) chance = 0.007;
		else if ( game.opponents.length < 3 ) chance = 0.005;
		else if ( game.opponents.length < 6 ) chance = 0.003;
		else if ( game.opponents.length < 10 ) chance = 0.001;
		else if ( game.opponents.length >= 10 ) chance = 0;
		if ( chance >= Math.random() ) newEnemy( "fighter", canvas.width+Math.random()*400,
			-Math.random()*300 );
		}
	};
