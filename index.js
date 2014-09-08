var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req,res) {
	res.sendfile('index.html');
});

app.get('/move', function(req,res) {
	res.sendfile('phone_move.html');
});

app.get('/main_move.js', function(req,res) {
	res.sendfile('main_move.js');
});

app.get('/test', function(req,res) {
	res.sendfile('test.html');
});

app.get('/images/phone.png', function(req,res) {
	res.sendfile('images/phone.png');
});

app.get('/images/sword.png', function(req,res) {
	res.sendfile('images/sword.png');
});

app.get('/main.js', function(req,res) {
	res.sendfile('main.js');
});

app.get('/snap.svg-min.js', function(req,res) {
	res.sendfile('snap.svg-min.js');
});

app.get('/paper-full.min.js', function(req,res) {
	res.sendfile('paper-full.min.js');
});

app.get('/drawing.js', function(req,res) {
	res.sendfile('drawing.js');
});

var channel = '4995';
var lastMove;
io.on('connection', function(socket) {
	console.log('a user connected');

	socket.on('4995', function(msg) {
		//console.log(msg);
		io.emit('4995', msg);
	})

	socket.on('5000', function(msg) {
		console.log(msg);
		io.emit('5000', msg);
	})

	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});

http.listen(3000, function() {
	console.log("listening on *:3000");
});