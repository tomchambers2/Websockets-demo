window.onload = function() {
	var supportsVibrate = "vibrate" in navigator;

	var channel = prompt("Enter the code from http://url.com to link and start playing");
	
	FastClick.attach(document.body);

	var socket = io();	
	if (channel) {
		socket.emit('establish',channel);

		var touchTimer;
		var strength;
		var touchPad = document.getElementById('touch');
		var intervals = {};
		touchPad.addEventListener('touchstart', function(e) {
			e.preventDefault();
			console.log('hit');
			touchTimer = Date.now();

			intervals.interval = setInterval(function() {
				touchLength = Date.now() - touchTimer;

				var widthPercent = (touchLength / 400) * 100;
				widthPercent = widthPercent > 100 ? '100' : widthPercent;
				document.getElementById('progress-bar-blocker').style.width = (100-widthPercent) + '%';	
			}, 16);
		});
		touchPad.addEventListener('touchend', function() {
			clearInterval(intervals.interval);
			console.log('released')
			touchLength = Date.now() - touchTimer;

			var widthPercent = (touchLength / 250) * 100;
			widthPercent = widthPercent > 100 ? '100' : widthPercent;
			document.getElementById('progress-bar-blocker').style.width = (100-widthPercent) + '%';	
			strength = widthPercent;		
		});


		touchPad.addEventListener('click', function() {
			socket.emit('hit', {strength: strength});
			if (supportsVibrate) {
				navigator.vibrate(300);
			};
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

