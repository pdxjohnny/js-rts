<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="http://pdxjohnny.tk:8000/socket.io/socket.io.js"></script>

Users connected: <span id="usersConnected"></span><br>
<form id="addMessage" action="" >
	New Message: 
	<input id="newMessage" type="text" ></input>
</form>
Messages:<br>
<div id="messages" ></div>

<script>
// Connect to our node/websockets server
var socket = io.connect('http://pdxjohnny.tk:8000');

$(document).ready(function(){
 
	// New socket connected, display new count on page
	socket.on('users connected', function(number){
		$('#usersConnected').html(number);
		});
 
	// Messages sent from server
	socket.on('current messages', function(messages){
		$('#messages').html("");
		for ( var i in messages ){
			$('#messages').append( messages[i] + "<br>" );
			}
		});
	});

$('#addMessage').on("submit", function (e) {
	e.preventDefault();
	var message = $('#newMessage').val();
	$('#newMessage').val("");
	socket.emit('new message', message );
	return false;
	});
</script>
