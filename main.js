//add touch element
window.onload = function() {
//check we have a channel to go to
	var channel = '4995';
	//open websocket connection
	var socket = io();	
	var touchPad = document.getElementById('touch');
	touchPad.addEventListener('click', function() {
		socket.emit('5000', 'hit');
	});
}