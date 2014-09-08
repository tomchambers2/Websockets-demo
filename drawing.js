var channel = '4995';
var phoneWidth = $('.phone').width() / 2;
var currentPosition = {};
var circles = [];

var socket = io();

socket.on('4995', function(msg) {
	if (msg.z != null) {
		var xForScreen = msg.x - 90;
		var zForScreen = -msg.z;
		currentPosition.x = xForScreen;
		currentPosition.y = msg.y;
		currentPosition.z = msg.z;
		phone.style.transform = 'rotateX('+xForScreen+'deg) rotateY('+(msg.y)+'deg) rotateZ('+(zForScreen)+'deg)';
	};
});

socket.on('5000', function(msg) {
	if (msg === 'hit') {
		fireItem($('.handle.nw').offset().left + phoneWidth, $('.handle.nw').offset().top);
	}
});

function fireItem(x,y) {
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

		var zRadians = circles[i].angle * (Math.PI / 180);
		var xRadians = (90 - circles[i].angleX) * (Math.PI / 180);

		var moveY = Math.sin(xRadians) * circles[i].velocityY;
		var moveX = Math.sin(zRadians) * circles[i].velocityX;

		circles[i].position.x -= moveX;
		circles[i].position.y -= moveY;
	}
};