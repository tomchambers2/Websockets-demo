var phoneWidth = $('.phone').width() / 2;
var currentPosition = {};
var circles = [];
var dropping = [];
var score = 0;
var loading = true;
var gameOver = false;
var timePassed = 0;

var HIT_SCORE = 100;
var DROP_RATE = 30; //will drop 1 in every n frames
var FONT_FAMILY = 'Coda';
var FONT_SIZE = 30;
var TIME_IN_SECONDS = 120;

socket.on('rotation', function(msg) {
	if (loading===true) {
		document.getElementById('intro').style.display = 'none';
		loading = false;		
	}
	if (msg.z != null) {
		var xForScreen = msg.x - 90;
		var zForScreen = -msg.z;
		currentPosition.x = xForScreen;
		currentPosition.y = msg.y;
		currentPosition.z = msg.z;
		phone.style.transform = 'rotateX('+xForScreen+'deg) rotateY('+(msg.y)+'deg) rotateZ('+(zForScreen)+'deg)';
	};
});

socket.on('hit', function(msg) {
	if (!loading) {
		fireItem($('.handle.nw').offset().left + phoneWidth, $('.handle.nw').offset().top, msg.strength);
	}
});

function dropItem() {
	/*
	var positionX = Math.floor(Math.random() * view.bounds.width);
	var circle = new Path.Circle(new Point(positionX,-50), 50);
	circle.velocity = 1;
	circle.fillColor = 'green';
	dropping.push(circle);
	*/

	var raster = new Raster('parachute');
	var positionX = Math.floor(Math.random() * view.bounds.width);
	raster.position = new Point(positionX,-50);
	raster.scale(0.3)
	raster.velocity = 1;
	raster.fillColor = 'green';
	dropping.push(raster);
};

function fireItem(x,y,strength) {
	var circle = new Path.Circle(new Point(x,y), 30);
	circle.fillColor = 'black';
	var velocity = 14 * (strength / 100);
	circle.velocityY = velocity;
	circle.velocityX = velocity;
	circle.velocityZ = velocity;
	circle.angle = currentPosition.z;
	circle.angleX = currentPosition.x;
	circle.hits = 0;
	circle.kills = [];
	circles.push(circle);
};

function addToScore(increment) {
	score += increment;
	scoreText.content = 'Score: '+score;
}
var scoreText = new PointText(new Point(30,40));
scoreText.fontFamily = FONT_FAMILY;
scoreText.fontSize = FONT_SIZE;
scoreText.fillColor = 'black';
addToScore(0);

function str_pad_left(string,pad,length){   return (new Array(length+1).join(pad)+string).slice(-length);   } 
function updateTimerSeconds(seconds) {
	timerMinutes = Math.floor(seconds / 60);
	timerSeconds = seconds - timerMinutes * 60;
	timerFormatted = str_pad_left(timerMinutes,'0',2) + ':' + str_pad_left(timerSeconds,'0',2);
	timerText.content = 'Time remaining: '+timerFormatted;
}

var timerText = new PointText(new Point(view.bounds.width - 335,40));
timerText.fontFamily = FONT_FAMILY;
timerText.fontSize = FONT_SIZE;
timerText.fillColor = 'black';
var timer = TIME_IN_SECONDS;
updateTimerSeconds(timer);

function restartGame() {
	score = 0;
	timer = TIME_IN_SECONDS;
	updateTimerSeconds(timer);
	gameOver = false;
	document.getElementById('gameover').style.display = 'none';
	for (var i = 0;i<circles.length;i++) {
		circles[i].remove();
	}
	circles = [];
	for (var i = 0;i<dropping.length;i++) {
		dropping[i].remove();
	}
	dropping = [];
}

function onFrame(event) {
	if (loading) return;
	if (gameOver) {
		console.log('game over, done');
		document.getElementById('gameover').style.display = 'block';
		document.getElementById('final-score').innerHTML = score;
		document.getElementById('restart-button').addEventListener('click', function() {
			restartGame();
		});
		return;
	}

	if (event.time > timePassed + 1) {
		timer -= 1;
		if (timer<=0) {
			gameOver = true;
		}
		updateTimerSeconds(timer);
		timePassed = event.time;
	}

	for (var i = 0;i<circles.length;i++) {
		if (circles[i].bounds.top > view.bounds.height) {
			circles[i].remove();
			circles.splice(i, 1);
			continue;
		}

		//gravity
		circles[i].velocityY -= 0.35;

		var zRadians = circles[i].angle * (Math.PI / 180);
		var xRadians = (90 - circles[i].angleX) * (Math.PI / 180);

		var moveY = Math.sin(xRadians) * circles[i].velocityY;
		var moveX = Math.sin(zRadians) * circles[i].velocityX;

		var moveZ = Math.abs(Math.cos(xRadians) * circles[i].velocityZ);
		circles[i].scale(1- (moveZ/2000));

		circles[i].position.x -= moveX;
		circles[i].position.y -= moveY;

		for (var j = 0;j<dropping.length;j++) {
			if (circles[i].kills.indexOf(dropping[j].id) > -1) {
				console.log('already hit');
				continue;
			};
			var point = new Point(dropping[j].position.x, dropping[j].position.y);
			var hitOptions = {
				fill: true,
				stroke: true,
				segments: true,
				tolerance: 65
			}
			if (circles[i].hitTest(point, hitOptions)) {
				console.log(dropping[j].id);
				circles[i].kills.push(dropping[j].id);
				dropping[j].fillColor = 'red';
				dropping[j].velocity = 10;
				addToScore(HIT_SCORE);
				circles[i].hits++;
				if (circles[i].hits === 2) {
					console.log("DOUBLE HIT COMBO!!!",circles[i].hits);
				}
				if (circles[i].hits > 2) {
					console.log("MULTI HIT COMBO!!!",circles[i].hits);
				}				
			}
		}
 	}

	for (var k = 0;k<dropping.length;k++) {
		if (dropping[k].bounds.top > view.bounds.height) {
			dropping[k].remove();
			dropping.splice(k, 1);
			continue;
		}
		dropping[k].position.y += dropping[k].velocity;
	}

	if (event.count % DROP_RATE === 0) {
		dropItem();
	}
};