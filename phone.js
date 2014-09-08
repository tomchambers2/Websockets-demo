window.onload = function() {
	var channel = prompt("Enter the code from http://url.com to link and start playing");

	FastClick.attach(document.body);

	var socket = io();	
	if (channel) {
		socket.emit('establish',channel);

		var touchPad = document.getElementById('touch');
		touchPad.addEventListener('click', function() {
			socket.emit('hit', 'hit');
		});

		window.addEventListener('deviceorientation', function(event) {
			var orientation = {
				x: event.beta,
				y: event.gamma,
				z: event.alpha
			}
			socket.emit('rotation', orientation);
			console.log('rotation');
		});
	}	
}

