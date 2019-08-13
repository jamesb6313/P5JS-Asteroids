//See: https://thecodingtrain.com/CodingChallenges/046.1-asteroids-part-1.html

var ship;
var asteroids = [];
var lasers = [];

var rapid = false;
var rapidStart = 0;
var loopCtr = 0;

var score;
var hits;

function setup() {
	// put setup code 
	createCanvas(400, 400); //(windowWidth, windowHeight);
	colorMode(RGB);
	
	ship = new Ship();
	for (var i = 0; i < 5; i++) {
		asteroids.push(new Asteroid());
	}
	
	//avoid making Asteroid on ship
	/* for (var a of asteroids) {
		
		var d = dist(ship.pos.x, ship.pos.y, a.pos.x, a.pos.y);
		if (d < ship.r + a.r) {
			
		}			
	} */
	
	textSize(32);
	score = 0;
	hits = 0;
	
}

function draw() {
	// put drawing code here
	background(0);
	loopCtr += 1;
	
	fill(255);
	text('Score: ' + score, 10, 50);
	text('Hits: ' + hits, 250, 50);
	
	for (var i = 0; i < asteroids.length; i++) {
		if (ship.hits(asteroids[i])) {
			console.log('oooops!');
			hits += 1;
		}
		asteroids[i].render();
		asteroids[i].update();
		asteroids[i].edges();
	}
	
	if (rapid) {
		if (loopCtr - rapidStart < 50) {
			lasers.push(new Laser(ship.pos, ship.heading));
		} else {
			rapid = false;
		}
	}
	
	laserFire();
	
	ship.render();
	ship.turn();
	ship.update();
	ship.edges();
} 

function laserFire() {
	for (var i = lasers.length - 1; i >= 0; i--) {
		lasers[i].render();
		lasers[i].update();
			
		if (lasers[i].offscreen()) {
			lasers.splice(i, 1);

		} else {
		
			for (var j = asteroids.length - 1; j >= 0; j--) {
				if (lasers[i].hits(asteroids[j])) {
					score++;
					if (asteroids[j].r > 10) {
						var newAsteroids = asteroids[j].breakup();						
						asteroids = asteroids.concat(newAsteroids);
					}
					asteroids.splice(j, 1);
					lasers.splice(i, 1);
					break;
				}
			}
		}
	}
}

function keyReleased() {
	if (key == 'a') {
		rapid = false;
		console.log('Key a released');
	}
	ship.setRotation(0);
	ship.boosting(false);
}

function keyPressed() {
	if (key == 'a') {
		rapid = true;
		rapidStart = 0;
		rapidStart = loopCtr;
		ship.setRotation(1);
		ship.boosting(false);
		lasers.push(new Laser(ship.pos, ship.heading));
	} else if (key == ' ') {
		lasers.push(new Laser(ship.pos, ship.heading));
	} else if (keyCode == RIGHT_ARROW) {
		ship.setRotation(0.1);
	} else if (keyCode == LEFT_ARROW) {
		ship.setRotation(-0.1);
	} else if (keyCode == UP_ARROW) {
		ship.boosting(true);
	}
}