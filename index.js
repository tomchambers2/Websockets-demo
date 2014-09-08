var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req,res) {
	res.sendfile('index.html');
});

app.get('/style.css', function(req,res) {
	res.sendfile('style.css');
});

app.get('/phone', function(req,res) {
	res.sendfile('phone.html');
});

app.get('/phone.js', function(req,res) {
	res.sendfile('phone.js');
});

app.get('/main.js', function(req,res) {
	res.sendfile('main.js');
});

app.get('/main_move.js', function(req,res) {
	res.sendfile('main_move.js');
});

app.get('/images/sword.png', function(req,res) {
	res.sendfile('images/sword.png');
});

app.get('/images/cannon.png', function(req,res) {
	res.sendfile('images/cannon.png');
});

app.get('/images/megacannon.png', function(req,res) {
	res.sendfile('images/megacannon.png');
});

app.get('/images/parachute.png', function(req,res) {
	res.sendfile('images/parachute.png');
});

app.get('/main.js', function(req,res) {
	res.sendfile('main.js');
});

app.get('/paper-full.min.js', function(req,res) {
	res.sendfile('paper-full.min.js');
});

app.get('/drawing.js', function(req,res) {
	res.sendfile('drawing.js');
});

io.on('connection', function(socket) {
	console.log('a user connected',socket.id);

	var channel;

	socket.on('establish', function(channel) {
		socket.join(channel);
		console.log(channel);

		socket.on('rotation', function(msg) {
			io.sockets.in(channel).emit('rotation', msg);
		});

		socket.on('hit', function(msg) {
			io.sockets.in(channel).emit('hit', msg);
		});	
	});

	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});

http.listen(3000, function() {
	console.log("listening on *:3000");
});