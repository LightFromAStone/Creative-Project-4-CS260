$(function(){
   	//make connection
	var socket = io.connect('http://lightfromastone.me:4200');

	//buttons and inputs
	var message = $("#message");
	var username = $("#username");
	var send_message = $("#send_message");
	var send_username = $("#send_username");
	var chatroom = $("#chatroom");
	var feedback = $("#feedback");
	
	var load = $('#load_history');
	
	//Request message history
	load.click(function(g) {
	   g.preventDefault(); 
	   socket.emit('load_history');
	});
	
	//Listen for pushed history
	socket.on('load_history', (data) => {
	   for(var i = 0; i < data.length; ++i) {
	    chatroom.append('<p class="message">' + data[i].username + ': ' + data[i].message + '</p>');
	    }
	    console.log(data); 
	});
	

	//Emit message
	send_message.click(function(e){
	    e.preventDefault();
		socket.emit('new_message', {message : message.val()});
	});

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>");
	});

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()});
	});

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing');
	});

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>");
	});
});