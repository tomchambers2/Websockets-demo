var phoneWidth = $('.phone').width() / 2;
var currentPosition = {};
var circles = [];
var dropping = [];
var score = 0;
var hitScore = 100;
var loading = true;

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
	if (msg === 'hit' && !loading) {
		fireItem($('.handle.nw').offset().left + phoneWidth, $('.handle.nw').offset().top);
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

function fireItem(x,y) {
	var circle = new Path.Circle(new Point(x,y), 30);
	circle.fillColor = 'black';
	circle.velocityY = 14;
	circle.velocityX = 14;
	circle.velocityZ = 14;
	circle.angle = currentPosition.z;
	circle.angleX = currentPosition.x;
	circle.hits = 0;
	circles.push(circle);
};

function addToScore(increment) {
	score += increment;
	scoreText.innerHTML = score;
}

function onFrame(event) {
	if (loading) return;
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
			var point = new Point(dropping[j].position.x, dropping[j].position.y);
			var hitOptions = {
				fill: true,
				stroke: true,
				segments: true,
				tolerance: 65
			}
			if (circles[i].hitTest(point, hitOptions)) {
				dropping[j].fillColor = 'red';
				dropping[j].velocity = 10;
				//addToScore(hitScore);
				circles[i].hits++;
				if (circles[i].hits > 1) {
					//needs to track which men it has hit, don't add hits for same man twice
					console.log("MULTI HIT COMBO!!!",circles[i].hits)
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

	if (event.count % 100 === 0) {
		dropItem();
	}
};