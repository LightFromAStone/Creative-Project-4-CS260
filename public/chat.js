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
	   $("#load_history").attr("hidden", true);
	   $("#form-container").attr("hidden", false)
	   socket.emit('load_history');
	});
	
	//Listen for pushed history
	socket.on('load_history', (data) => {
	   for(var i = 0; i < data.length; ++i) {
	    chatroom.append('<p class="message"><strong>' + data[i].username + ': </strong>' + data[i].message + '</p>');
	    }
	    console.log(data); 
	});
	

	//Emit message
	send_message.click(function(e){
	    e.preventDefault();
	    if (message.val() != "") {                                  //Prevents users from spamming blank messages
			socket.emit('new_message', {message : message.val()});
	    }
	});

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'><strong>" + data.username + ": </strong>" + data.message + "</p>");
		if((document.documentElement.scrollTop || document.body.scrollTop) != 0) {       //Prevents page from scrolling to bottom when new message is added if not already at bottom
			window.scrollTo(0,document.body.scrollHeight);
		}
	});

	//Emit a username
	send_username.click(function(a){
		a.preventDefault();
		if(username.val() != "") {
			alert("username has been changed!");
			socket.emit('change_username', {username : username.val()});
		}
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