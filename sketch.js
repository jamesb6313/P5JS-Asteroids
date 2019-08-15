//See: https://thecodingtrain.com/CodingChallenges/046.1-asteroids-part-1.html

const { 
	Engine, 
	World, 
	Bodies, 
	Body, 
	Mouse, 
	MouseConstraint, 
	Constraint,
	Events,
	Detector
} = Matter;

var ship;
var mybox;
var asteroids = [];
var lasers = [];

var rapid = false;
var rapidStart = 0;
var loopCtr = 0;

var score;
var hits;

let world, engine;

function setup() {
	// put setup code 
	const canvas = createCanvas(800, 600); //(windowWidth, windowHeight);
	
	engine = Engine.create();
	world = engine.world;
	world.gravity.y = 0;
	
	addEvents(engine);
	
	//colorMode(RGB);
	mybox = new Box(width - 100, height / 2, 50, 50);
	
	ship = new Ship(width/2,height/2, 50, 0);
	for (var i = 0; i < 1; i++) {
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
	Matter.Engine.update(engine);

	if (ship.health <= 0) {	// Stop
		noLoop();
	}
	loopCtr += 1;
	
	fill(255);
	text('Score: ' + score, 10, 50);
	text('Hits: ' + hits, 250, 50);
	
	/* for (var i = 0; i < asteroids.length; i++) {
		if (ship.hits(asteroids[i])) {
			console.log('oooops! - ', ship.health);
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
	
	laserFire(); */
/* 	var broadphase = engine.broadphase;
	var broadphasePairs = [];
	
	//var pair = [];
	broadphasePairs.push(ship);
	broadphasePairs.push(box);
	console.log(broadphasePairs);
	
	var colArray = Detector.collisions(broadphasePairs, engine);
	for (i = 0; i < colArray.length; i++) {
		console.log("here");
	} */
	mybox.show();
	ship.edges();
	ship.show();
	

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
		lasers.push(new Laser(ship.body.position, ship.body.angle));
	} else if (key == ' ') {
		lasers.push(new Laser(ship.body.position, ship.body.angle));
	} else if (keyCode == RIGHT_ARROW) {
		ship.setRotation(0.02);
	} else if (keyCode == LEFT_ARROW) {
		ship.setRotation(-0.02);
	} else if (keyCode == UP_ARROW) {
		ship.boost();
	}
}