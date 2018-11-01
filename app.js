const express = require('express');
const app = express();

var history = [];


//set the template engine ejs
app.set('view engine', 'ejs');

//middlewares
app.use(express.static('public'));


//routes
app.get('/', (req, res) => {
	res.render('index');
});

//Listen on port 4200
var server = app.listen(4200);



//socket.io instantiation
const io = require("socket.io")(server);


//listen on every connection
io.on('connection', (socket) => {
	console.log('New user connected');

	//default username
	socket.username = "Anonymous";

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username;
    });

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
        history.push({username : socket.username, message : data.message});
    });

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username});
    });
    
    socket.on('load_history', () => {
        socket.emit('load_history', history);
    })
});