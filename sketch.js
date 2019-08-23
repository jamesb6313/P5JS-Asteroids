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
let numAsteroids = 1;
let maxAsteroids = 7;
var lasers = [];

var rapid = false;
var removeAsteroids = false;
var rapidStart = 0;
var loopCtr = 0;
let shipRadius = 30;
let minAsteroidRadius = 15;		//line48 addEvents.js
var divHUD,divHealth,divHealthBar;
var btnStop;

let score = 0;
let shots = 0;
let time = 0;
let timeSec = 0;
let timeMin = 0;
let gameTimeScale = 1;

let world, engine;
let p5DeltaT,p5Time;
let gamePause = false;
	
function setup() {
	const canvas = createCanvas(800, 600); //(windowWidth, windowHeight);

	engine = Engine.create();
	world = engine.world;
	
	console.log("world", world);
		
	world.gravity.y = 0;
	world.gravity.x = 0;
	
	setDomElements();
		
	// set game variables
	p5Time = 0;	
	
	addEvents(engine);
	ship = new Ship(width/2,height/2, shipRadius, 0);	
	mybox = new Box(width - 100, height / 2, 50, 50);
	

	for (var i = 0; i < numAsteroids; i++) {
		asteroids.push(new Asteroid());
		//console.log(asteroids[i]);
		//Body.setVelocity(asteroids[i].body, {x: asteroids[i].vel.x, y: asteroids[i].vel.y} );
		
	}
}

function draw() {
	background(0);
		
	if (gamePause) {
		deltaTime = 0;
		p5DeltaT = 0;
	}

	
	p5DeltaT = deltaTime;
	p5Time += p5DeltaT;
	Engine.update(engine, p5DeltaT);
	gameTimeScale = engine.timing.timeScale;

	if (asteroids.length == 0) {
		noLoop();
		gamePause = true;
		//let deltaTime = window.performance.now() - canvas._pInst._lastFrameTime;//
	
		// Continue
		drawContinueButton();
		
		// Stop
		drawStopButton();
		
		//Success message 
		
		//Goal target %health >= 75& Shooting% >=70 ?time?- skill level
		//neccesary for next level
		

	}
	
	if (frameCount % 10) {
		//console.log('number of bodies ; ', world.bodies.length);
		if (removeAsteroids) {
			for (var i = asteroids.length - 1; i >= 0; i--) {
				if (asteroids[i].body.label == 'asteroidDebris') {
					Body.scale(asteroids[i].body, asteroids[i].parentR, asteroids[i].parentR);
					asteroids[i].r = asteroids[i].parentR * 0.5;
					asteroids[i].body.circleRadius = asteroids[i].r;
					asteroids[i].body.label = 'asteroid';
					asteroids[i].show();
					//console.log('Debris', asteroids[i].body);
				}
			}
			removeAsteroids = false;
		}
	}

	if (ship.health <= 0) {	// Stop
		noLoop();
	}
	loopCtr += 1;

	//Display in divHUD
	setHUD();
	
	//Display on canvas
	setCanvasDisplay();

	if (rapid) {
		if (loopCtr - rapidStart < 50) {
			lasers.push(new Laser(ship));
			shots++;
		} else {
			rapid = false;
		}
	}

	for (let i = 0; i < asteroids.length; i++) {
		asteroids[i].show();
		asteroids[i].edges();
	}
	
	laserEndCycle();
	laserFire();

	mybox.show();
	ship.edges();
	ship.show();
	healthBar();

}

function laserFire() {
	for (var i = lasers.length - 1; i >= 0; i--) {
		lasers[i].show();
	}
}

function laserEndCycle() {
	for (var i = lasers.length - 1; i >= 0; i--) {
		lasers[i].offscreen();
	}
}

//ship health bar
function healthBar() {
	var percent = 1 - ship.health;	
	var newWidth = floor((300 * percent) );
	
	if (newWidth > 300) {
		newWidth = 300;
	}

	divHealthBar.style('width', newWidth + 'px');
}