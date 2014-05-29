function getShip( aid, name, type, image, stats ){
	for ( var i in ships ){
		if ( name === ships[i].name ) return new ships[i]( type, image, stats );
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
	fighter: function fighter( type, image, stats ){
		this.shipName = "fighter";
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
	cruser: function cruser( type, image, stats ){
		this.shipName = "cruser";
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
				stats: "advanced", cost: 3000 },
			];
		this.options = function options(){
			$('#bottomLeft').html("<h4>"+this.shipName+"</h4><table cellspacing='10' >");
			$('#bottomLeft').append( "<tr>" );
			for ( var i in this.createableTypes ) {
				$('#bottomLeft').append( "<img src='"
					+this.createableTypes[i].image+"' ></img>" );
				}
			$('#bottomLeft').append( "</tr>" );
			$('#bottomLeft').append( "<tr>" );
			for ( var i in this.createableTypes ) {
				$('#bottomLeft').append( this.createableTypes[i].shipName );
				}
			$('#bottomLeft').append( "</tr>" );
			$('#bottomLeft').append( "<tr>" );
			for ( var i = 0; i < this.createableTypes.length; i++ ) {
				$('#bottomLeft').append( "<a href='#' onclick='game.structuresL["
					+this.aid+"].ship.create("+i+")' >Create</a>" );
				}
			$('#bottomLeft').append( "</tr>" );
			$('#bottomLeft').append( "</table>" );
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
