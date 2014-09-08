//check we have a channel to go to
var channel = '4995';

//open websocket connection
var socket = io();

if (channel) {
	window.addEventListener('deviceorientation', function(event) {
		var orientation = {
			x: event.beta,
			y: event.gamma,
			z: event.alpha
		}
		socket.emit('4995', orientation);
	});
}

var currentPosition = {};

var fire = document.getElementById('fireButton');
fire.addEventListener('click', function() {
	fireItem($('.handle.nw').offset().left, $('.handle.nw').offset().top);
});

var circles = [];
function fireItem(x,y) {
	console.log('boom!');
	var circle = new Path.Circle(new Point(x,y), 50);
	circle.fillColor = 'black';
	circle.velocityY = 10;
	circle.velocityX = 10;
	circle.angle = currentPosition.z;
	circle.angleX = currentPosition.x;
	circles.push(circle);
};

function onFrame() {
	for (var i = 0;i<circles.length;i++) {
		//gravity
		circles[i].velocityY -= 0.6;

		//new position = movement/velocity *
		var zRadians = circles[i].angle * (Math.PI / 180);
		var xRadians = (90 - circles[i].angleX) * (Math.PI / 180);

		var height = Math.sin(xRadians) * circles[i].velocityY;

		moveX = Math.sin(zRadians) * circles[i].velocityX;
		//moveY = Math.cos(zRadians) * circles[i].velocity;

		moveY = height;

		circles[i].position.x -= moveX;
		circles[i].position.y -= moveY;
	}
};

socket.on('4995', function(msg) {
	if (msg.z != null) {
		var xForScreen = msg.x - 90;
		var zForScreen = -msg.z;
		currentPosition.x = xForScreen;
		currentPosition.y = msg.y;
		currentPosition.z = msg.z;
		phone.style.transform = 'rotateX('+xForScreen+'deg) rotateY('+(msg.y)+'deg) rotateZ('+(zForScreen)+'deg)';
		//phone.style.transform = 'rotateZ('+(zForScreen)+'deg)';
	};
});

socket.on('5000', function(msg) {
	if (msg === 'hit') {
		fireItem();
	}
});