//check we have a channel to go to
var channel = '4995';

//open websocket connection
var socket = io();

if (channel) {
	window.addEventListener('devicemotion', function(event) {
		if (event.acceleration.x) {
			socket.emit('4995', event);
		};
	});
}
	var velocity = {
		x: 0,
		y: 0
	};
	var FRICTION = 0.0022;

	var lastMove = Date.now();
	socket.on('4995', function(msg) {
		//if (Date.now() > lastMove + 16) {
			var phone = document.getElementById('phone');

			var acceleration = msg.acceleration.x;
			var interval = msg.interval;

			//velocity.x = velocity.x + (acceleration * interval);

			//distance = (accel * 0.5) * time^2

			velocity.x = velocity.x + (acceleration * 0.5) * (interval*interval);

			/*if (velocity.x > 0) {
				console.log(acceleration, velocity.x, 'decreased vel');
				velocity.x -= FRICTION;
			} else {
				console.log(acceleration, velocity.x, 'increased vel');
				velocity.x += FRICTION;
			}*/
			
			var screenVelocity = velocity.x * 1000;
			//if (velocity.x > 0.001) {
				var newLeft = $('.phone').position().left + -(screenVelocity);
				console.log(newLeft);
				$('.phone').css({ 'left': newLeft });
			//};

			lastMove = Date.now();
		//};
	});