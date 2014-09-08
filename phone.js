window.onload = function() {
	var channel = prompt("Enter the code from http://url.com to link and start playing");
	

	FastClick.attach(document.body);

	var socket = io();	
	if (channel) {
		socket.emit('establish',channel);

		var touchTimer;
		var strength;
		var touchPad = document.getElementById('touch');
		touchPad.addEventListener('touchstart', function(e) {
			e.preventDefault();
			console.log('hit');
			touchTimer = Date.now();

			/*setInterval(function() {
				var width = (Date.now() - touchTimer);
				var widthPercent = width / 1000 * 100;
				document.getElementById('progress').style.width = widthPercent + '%';
			}, 16);*/
		});
		touchPad.addEventListener('touchend', function() {
			console.log('released')
			touchTimer = Date.now() - touchTimer;
			document.getElementById('power').innerHTML = touchTimer;

			var widthPercent = (touchTimer / 250) * 100;
			console.log(widthPercent);
			widthPercent = widthPercent > 100 ? '100' : widthPercent;
			document.getElementById('progress').style.width = widthPercent + '%';	
			strength = widthPercent;		
		});


		touchPad.addEventListener('click', function() {
			socket.emit('hit', {strength: strength});
		});

		window.addEventListener('deviceorientation', function(event) {
			var orientation = {
				x: event.beta,
				y: event.gamma,
				z: event.alpha
			}
			socket.emit('rotation', orientation);
		});
	}	
}

