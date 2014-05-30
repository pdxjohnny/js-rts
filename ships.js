function getShip( aid, name, type, image, stats ){
	for ( var i in ships ){
		if ( name === ships[i].name ) return new ships[i]( aid, type, image, stats );
		}
	for ( var i in structures ){
		if ( name === structures[i].name ) return new structures[i]( aid, type, image, stats );
		}
	}

function getStats( type ){
	for ( var i in stats ){
		if ( type === stats[i].name ) return new stats[i]();
		}
	//if ( type === "balenced" ) ship.stats = balenced;
	//if ( type === "advanced" ) ship.stats = advanced;
	}

var ships = {
	fighter: function fighter( aid, type, image, stats ){
		this.shipName = "Fighter";
		this.aid = aid;
		if ( typeof stats !== "undefined" ) {
			this.type = "upgaded";
			this.stats = stats;
			}
		else this.stats = getStats( type );
		this.Image = new Image();
		this.Image.onload = function () {
			this.Ready = true;
			};
		this.Image.src = image;
		this.options = function options(){
			$('#bottomLeft').html(this.name);
			};
		},
	cruser: function cruser( aid, type, image, stats ){
		this.shipName = "Cruser";
		this.aid = aid;
		if ( typeof stats !== "undefined" ) {
			this.type = "upgaded";
			this.stats = stats;
			}
		else this.stats = getStats( type );
		this.Image = new Image();
		this.Image.onload = function () {
			this.Ready = true;
			};
		this.Image.src = image;
		this.options = function options(){
			$('#bottomLeft').html(this.name);
			};
		},
	carrier: function carrier( aid, type, image, stats ){
		this.shipName = "Carrier";
		this.aid = aid;
		if ( typeof stats !== "undefined" ) {
			this.type = "upgaded";
			this.stats = stats;
			}
		else this.stats = getStats( type );
		this.Image = new Image();
		this.Image.onload = function () {
			this.Ready = true;
			};
		this.Image.src = image;
		this.createableTypes = [
			{ image: "images/ships/fighterblue.png", shipName: "fighter", 
				stats: "basic", cost: 1000 },
			{ image: "images/ships/cruser.png", shipName: "cruser", 
				stats: "middle", cost: 3000 },
			];
		this.options = function options(){
			createOptions( this, "meL.units" );
			};
		this.create = function create( arrayNumber ){
			var image = this.createableTypes[arrayNumber].image;
			var shipName = this.createableTypes[arrayNumber].shipName;
			var stats = this.createableTypes[arrayNumber].stats;
			var cost = this.createableTypes[arrayNumber].cost;
			var rand = {
				x: meL.units[this.aid].x + 
					this.Image.width/2 + ( Math.random()*100 )*2,
				y: meL.units[this.aid].y + 
					this.Image.height/2 + ( Math.random()*100 )*2,
				};
			if ( 0.70 > Math.random() ) rand.x -= ( Math.random()*100 )*4;
			if ( 0.70 > Math.random() ) rand.y -= ( Math.random()*100 )*4;
			if ( meL.funds >= cost ) {
				meL.funds -= cost;
				displayFunds();
				meL.units.push( new localObject( meL.id, meL.username, meL.units.length,
					meL.units[this.aid].x + this.Image.width/1.8,
					meL.units[this.aid].y + this.Image.height/1.8,
					image, shipName, stats ) );
				meL.units[meL.units.length-1].des = rand;
				}
			};
		},
	}

var structures = {
	merchantBase: function merchantBase( aid, type, image, stats ){
		this.shipName = "Merchant Base";
		this.aid = aid;
		if ( typeof stats !== "undefined" ) {
			this.type = "upgaded";
			this.stats = stats;
			}
		else this.stats = getStats( type );
		this.Image = new Image();
		this.Image.onload = function () {
			this.Ready = true;
			};
		this.Image.src = image;
		this.createableTypes = [
			{ image: "images/ships/fighterblue.png", shipName: "fighter", 
				stats: "basic", cost: 1000 },
			{ image: "images/ships/cruser.png", shipName: "cruser", 
				stats: "middle", cost: 3000 },
			{ image: "images/ships/carrier.png", shipName: "carrier", 
				stats: "advanced", cost: 10000 },
			];
		this.options = function options(){
			createOptions( this, "game.structuresL" );
			};
		this.create = function create( arrayNumber ){
			var image = this.createableTypes[arrayNumber].image;
			var shipName = this.createableTypes[arrayNumber].shipName;
			var stats = this.createableTypes[arrayNumber].stats;
			var cost = this.createableTypes[arrayNumber].cost;
			var rand = {
				x: game.structuresL[this.aid].x + 
					this.Image.width/2 + ( Math.random()*100 )*2,
				y: game.structuresL[this.aid].y + 
					this.Image.height/2 + ( Math.random()*100 )*2,
				};
			if ( 0.70 > Math.random() ) rand.x -= ( Math.random()*100 )*4;
			if ( 0.70 > Math.random() ) rand.y -= ( Math.random()*100 )*4;
			if ( meL.funds >= cost ) {
				meL.funds -= cost;
				displayFunds();
				meL.units.push( new localObject( meL.id, meL.username, meL.units.length,
					game.structuresL[this.aid].x, game.structuresL[this.aid].y,
					image, shipName, stats ) );
				meL.units[meL.units.length-1].des = rand;
				}
			};
		},
	}

function createOptions( ship, arrayName ){
	$('#bottomLeft').html("<h4>"+ship.shipName+"</h4><table >");
	$('#bottomLeft').append( "<tr>" );
	for ( var i in ship.createableTypes ) {
		$('#bottomLeft').append( "<img src='"
			+ship.createableTypes[i].image+"' ></img>" );
		}
	$('#bottomLeft').append( "</tr>" );
	$('#bottomLeft').append( "<tr>" );
	for ( var i in ship.createableTypes ) {
		$('#bottomLeft').append( ship.createableTypes[i].shipName );
		}
	$('#bottomLeft').append( "</tr>" );
	$('#bottomLeft').append( "<tr>" );
	for ( var i in ship.createableTypes ) {
		$('#bottomLeft').append( "Cost: "+ship.createableTypes[i].cost );
		}
	$('#bottomLeft').append( "</tr>" );
	$('#bottomLeft').append( "<tr>" );
	for ( var i = 0; i < ship.createableTypes.length; i++ ) {
		$('#bottomLeft').append( "<a href='#' onclick='"+arrayName+"["
			+ship.aid+"].ship.create("+i+")' >Create</a>" );
		}
	$('#bottomLeft').append( "</tr>" );
	$('#bottomLeft').append( "</table>" );
	}
