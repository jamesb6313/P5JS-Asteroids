//See: https://thecodingtrain.com/CodingChallenges/046.1-asteroids-part-1.html

var ship;
var asteroids = [];
var lasers = [];
var score;
var hits;

function setup() {
	// put setup code 
	createCanvas(400, 400); //(windowWidth, windowHeight);
	ship = new Ship();
	for (var i = 0; i < 5; i++) {
		asteroids.push(new Asteroid());
	}
	score = 0;
	hits = 0;
	
}

function draw() {
	// put drawing code here
	background(0);
	
	textSize(32);
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
	
	myLaserFire();

	
	ship.render();
	ship.turn();
	ship.update();
	ship.edges();
} 

function myLaserFire() {
	for (var i = lasers.length - 1; i >= 0; i--) {
		lasers[i].render();
		lasers[i].update();
			
		if (lasers[i].offscreen()) {
			lasers.splice(i, 1);

		} else {
		
			for (var j = asteroids.length - 1; j >= 0; j--) {
				if (lasers[i].hits(asteroids[j])) {
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
	//if (key != 'a') {
		ship.setRotation(0);
		ship.boosting(false);
	//}
	
		
}

function keyPressed() {
	if (key == ' ') {
		lasers.push(new Laser(ship.pos, ship.heading));
	} else if (key == 'a') {
		 
		
		ship.setRotation(0.1);

		//for (var i = 0; i < 2; i--) {
			lasers.push(new Laser(ship.pos, ship.heading));
		//}
		console.log(lasers);
		myLaserFire();
		
		//console.log(lasers);
		/* var pulse = new Laser(ship.pos, ship.heading);
		console.log(pulse);
		for (var i = 0; i < 10; i--) {
			pulse.push(new Laser(ship.pos, ship.heading));
			console.log(pulse);
		}
		for (i = 0; i < pulse.length - 1; i++) {
			pulse[i].render();
			pulse[i].update();
		}
		 */

	} else if (keyCode == RIGHT_ARROW) {
		ship.setRotation(0.1);
	} else if (keyCode == LEFT_ARROW) {
		ship.setRotation(-0.1);
	} else if (keyCode == UP_ARROW) {
		ship.boosting(true);
	}
}