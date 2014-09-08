var socket = io();

var channel = Math.floor(Math.random() * 9999);
socket.emit('establish', channel);

window.onload = function() {
	var codeText = document.getElementById('code');
	codeText.innerHTML = channel;
	var scoreText = document.getElementById('score');
	console.log(scoreText);
};