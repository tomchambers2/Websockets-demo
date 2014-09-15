var phoneWidth = $('.phone').width() / 2;
var currentPosition = {};
var circles = [];
var dropping = [];
var score = 0;
var loading = true;
var gameOver = false;
var timePassed = 0;
var textColor = 'white';
var playedEndSound = false;
var soundsOn = true;

var TOTAL_LIVES = 5;
var HIT_SCORE = 250;
var DROP_RATE = 150; //will drop 1 in every n frames
var FONT_FAMILY = 'Coda';
var FONT_SIZE = 30;
var TIME_IN_SECONDS = 60;

var employeeStatus = ['0 - Fired!','1 - Button jockey','2 - Panel technician','3 - Chief astrologer and throat warbler','4 - Space turkey','5 - Telescope fondler','6 - Rocket fuel pumper','7 - Flight director','8 - Spaceship manager','9 - Chief bigshot','10 - Stephen Hawking\'s PA','11 - Will Smith in Independence Day']

var LIVES = TOTAL_LIVES;

var explosion = new Audio('sounds/explosion.ogg');
var applause = new Audio('sounds/applause.mp3');
var boo = new Audio('sounds/boo.wav');
var cannon = new Audio('sounds/cannon.wav');
var backgroundMusic = new Audio('sounds/music.mp3');
backgroundMusic.addEventListener('ended', function() {
	this.currentTime = 0;
	this.play();
})
backgroundMusic.play();

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
	if (!loading && !gameOver) {
		fireItem($('.handle.nw').offset().left + phoneWidth, $('.handle.nw').offset().top, msg.strength);
		cannon.play();
		if (msg.strength<40) {
			showMessage("TAP HARDER!")
		}
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
	raster.velocity = 3;
	raster.fillColor = 'green';
	raster.rotation = 0;
	dropping.push(raster);
};

function fireItem(x,y,strength) {
	var circle = new Path.Circle(new Point(x,y), 30);

	//circle.fillColor = 'black';
	circle.fillColor = {
		gradient: {
			stops: ['#3E3E3E','black'],
			radial: true
		},
		origin: circle.position - 10,
		destination: circle.bounds.rightCenter
	}
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
scoreText.fillColor = textColor;
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
timerText.fillColor = textColor;
var timer = TIME_IN_SECONDS;
updateTimerSeconds(timer);

function decrementLives() {
	LIVES -= 1;
	livesText.content = 'Lives: '+LIVES;
	if (LIVES<1) {
		gameOver = true;
		showMessage('TOO MANY GOT THROUGH');
		showMessage('GAME OVER');
		showMessage('YOU HAVE DIED');
		showMessage('OUT OF LIVES');
	}
}
var livesText = new PointText(new Point(view.bounds.width / 2 - 100,40));
livesText.fontFamily = FONT_FAMILY;
livesText.fontSize = FONT_SIZE;
livesText.fillColor = textColor;
livesText.content = 'Lives: '+LIVES;

function showMessage(content) {
	var message = new PointText(new Point(view.bounds.width - 400, view.bounds.height - 400) * Point.random());
	message.content = content;
	message.fontFamily = FONT_FAMILY;
	message.fillColor = textColor;
	message.fontSize = 60;	
	setTimeout(function() {
		message.content = '';
	},2000)
}

function restartGame() {
	score = 0;
	timer = TIME_IN_SECONDS;
	LIVES = TOTAL_LIVES;
	DROP_RATE = 150;
	livesText.content = 'Lives: '+LIVES;
	updateTimerSeconds(timer);
	gameOver = false;
	document.getElementById('won').style.display = 'none';
	document.getElementById('died').style.display = 'none';
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
		document.getElementById('gameover').style.display = 'block';
		if (LIVES > 0) {
			console.log('player won');
			if (!playedEndSound && soundsOn === true) {
				applause.play();
				playedEndSound = true;
			}
			document.getElementById('won').style.display = 'block';
		} else {
			console.log('player lost');
			if (!playedEndSound && soundsOn === true) {
				boo.play();
				playedEndSound = true;
			}
			document.getElementById('died').style.display = 'block';
		}
		var employeeLevel = Math.floor(score / 1000);
		console.log(employeeLevel);
		console.log(employeeStatus.length, employeeStatus.length - 1);
		if (employeeLevel > employeeStatus.length - 1) {
			employeeLevel = employeeStatus[length - 1];
		}
		document.getElementById('employee-status').innerHTML = employeeStatus[employeeLevel];
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

		DROP_RATE -= 2;
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
		circles[i].rotate(1);

		for (var j = 0;j<dropping.length;j++) {
			if (circles[i].kills.indexOf(dropping[j].id) > -1) {
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
				if (soundsOn === true) { explosion.play(); };
				circles[i].kills.push(dropping[j].id);
				console.log("hit image is", dropping[j].id)
				dropping[j].dead = true;
				
				dropping[j].source = 'explosion';
				dropping[j].scale(4);

				dropping[j].velocity = 10;
				addToScore(HIT_SCORE);
				circles[i].hits++;
				if (circles[i].hits === 2) {
					showMessage('DOUBLE HIT! 300 POINTS');
					addToScore(300);
				}
				if (circles[i].hits > 2) {
					showMessage('COMBO HIT!! 1000 POINTS');
					addToScore(1000);
				}				
			}
		}
 	}

	for (var k = 0;k<dropping.length;k++) {
		if (dropping[k].bounds.top > view.bounds.height) {
			dropping[k].remove();
			if (!dropping[k].dead) {
				decrementLives();
			};
			dropping.splice(k, 1);
			continue;
		}
		dropping[k].position.y += dropping[k].velocity;
		if (dropping[k].dead) {
			dropping[k].rotate(1);
		}
	}

	if (event.count % DROP_RATE === 0) {
		dropItem();
	}
};