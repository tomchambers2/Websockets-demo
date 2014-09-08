var socket = io();

var channel = Math.floor(Math.random() * 9999);
socket.emit('establish', channel);

function str_pad_left(string,pad,length){   return (new Array(length+1).join(pad)+string).slice(-length);   } 

window.onload = function() {
	var codeText = document.getElementById('code');
	codeText.innerHTML = channel;
};

