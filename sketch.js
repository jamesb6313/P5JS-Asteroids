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
var removeAsteroids = false;
var rapidStart = 0;
var loopCtr = 0;
var shipRadius = 50;
var divHUD,divHealth,divHealthBar;
var btnStop;

var score;
var hits;

let world, engine;
var display;
let p5DeltaT,p5Time;
	
	
function stopGame() {
	noLoop();
}
	
function setup() {
	const canvas = createCanvas(800, 600); //(windowWidth, windowHeight);

	engine = Engine.create();
	world = engine.world;
	
	console.log("world", world);
		
	world.gravity.y = 0;
	world.gravity.x = 0;
	
	gameSetup();
	
	addEvents(engine);
	ship = new Ship(width/2,height/2, shipRadius, 0);	
	mybox = new Box(width - 100, height / 2, 50, 50);
	

	for (var i = 0; i < 1; i++) {
		asteroids.push(new Asteroid());
		//console.log(asteroids[i]);
		//Body.setVelocity(asteroids[i].body, {x: asteroids[i].vel.x, y: asteroids[i].vel.y} );
		
	}
	
	textSize(32);
	score = 0;
	hits = 0;
}
	

function draw() {
	background(0);

	if (frameCount % 10) {
		//console.log('number of bodies ; ', world.bodies.length);
		if (removeAsteroids) {
			for (var i = asteroids.length - 1; i >= 0; i--) {
				if (asteroids[i].body.label == 'asteroidDebris') {
					Body.scale(asteroids[i].body, 20, 20);
					asteroids[i].body.label == 'asteroid';
					asteroids[i].show();
					console.log('Debris', asteroids[i].body);
				}
			}
			removeAsteroids = false;
		}
	}

	getHUD();
	
	p5DeltaT = deltaTime;
	p5Time += p5DeltaT;
	Engine.update(engine, p5DeltaT);

	if (ship.health <= 0) {	// Stop
		noLoop();
	}
	loopCtr += 1;
	
	fill(255);
	text('Score: ' + score, 10, 50);
	text('Hits: ' + hits, 250, 50);
	
	/* if (rapid) {
		if (loopCtr - rapidStart < 50) {
			lasers.push(new Laser(ship.pos, ship.heading));
		} else {
			rapid = false;
		}
	}*/

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

function healthBar() { // player health bar
	var percent = 1 - ship.health;	
	var newWidth = floor((300 * percent) );

	divHealthBar.style('width', newWidth + 'px');
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

function getHUD() {
	display =  
	'<table> ' +
		'<tr> <td>&nbsp;m_t:</td>  <td>' 
			+ engine.timing.timestamp.toFixed(0) + '</td> </tr>' + 
		'<tr> <td>&nbsp;p5t:</td>  <td>' 
			+ p5Time.toFixed(0) + '</td> </tr>' + 
		'<tr> <td style="color:#77f;">&nbsp;x:</td>    <td>' 
			+ ship.body.position.x.toFixed(0) + '</td> </tr>' +
		'<tr> <td style="color:#77f;">&nbsp;y:</td>    <td>' 
			+ ship.body.position.y.toFixed(0) + '</td> </tr>' +
		'<tr> <td style="color:#0dd;">Vx:</td>   <td>' 
			+ ship.body.velocity.x.toFixed(2) + '</td> </tr>' +
		'<tr> <td style="color:#0dd;">Vy:</td>   <td>' 
			+ ship.body.velocity.y.toFixed(2) + '</td> </tr>' +
		'<tr> <td style="color:#d0d;">H :</td>   <td>' 
			+ ship.health.toFixed(2) + '</td> </tr>' +
	'</table>';
	
	divHUD.html(display);
}

function gameSetup() {
	
	//create progress bar
	divHealth = select("#Health");	
	divHealthBar = select("#HealthBar");

	divHealth.position(0, height + 10);
	divHealthBar.position(0, height + 10);
	divHealth.style('background-color', color(200) );
	divHealthBar.style('background-color', color(255,0,0) );
	divHealthBar.style('text-align', 'center');
	
	
	//create HUD
	var pos = divHealth.position();
	divHUD = createDiv("").size(300,160); 	
	divHUD.position(0, pos.y + 30);
	divHUD.style('background-color', color(0,255,0) );
	
	//create stop button
	btnStop = createButton("Stop");
	btnStop.position(300 + 10, pos.y);
	btnStop.style('position:absolute');
		
	btnStop.mousePressed(stopGame);
	
	// set game variables
	p5Time = 0;	
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
		lasers.push(new Laser(ship));
	} else if (key == ' ') {
		lasers.push(new Laser(ship));
	} else if (keyCode == RIGHT_ARROW) {
		ship.setRotation(0.02);
	} else if (keyCode == LEFT_ARROW) {
		ship.setRotation(-0.02);
	} else if (keyCode == UP_ARROW) {
		ship.boost();
	}
}