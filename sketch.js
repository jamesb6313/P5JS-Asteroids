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
	

	for (var i = 0; i < numAsteroids; i++) {
		asteroids.push(new Asteroid());
		//console.log(asteroids[i]);
		//Body.setVelocity(asteroids[i].body, {x: asteroids[i].vel.x, y: asteroids[i].vel.y} );
		
	}
}

function testContinue(x, y) {
	// rect((width / 2) - 100, (height / 2), 100, 50, 20);
	let nx = 0; 
	let ny = 0;
	let cont = false;
	
	if (x > (width / 2) - 150) {
		//console.log('Here1a', (width / 2) - 100);
		if (x < (width / 2) - 50) {
			nx = 1;
			//console.log('Here1b',(width / 2) + 100);
		}
	}

	if (y > (height/2) - 25) {
		//console.log('Here2a', (height/2) - 25, (height/2) + 25);
		if (y < (height/2) + 25) {
			ny = 1;
			//console.log('Here2b');
		}
	}

	if (ny != 0 && nx != 0) {
		cont = true;
		console.log('CONTINUE BUTTON PRESSED');
	}	
	
	return cont;
}

function testStop(x, y) {
	//rect((width / 2) + 100, (height / 2), 100, 50, 20);	
	let nx = 0; 
	let ny = 0;
	let cont = false;
	
	if (x > (width / 2) + 50) {
		//console.log('Here1a', (width / 2) - 100);
		if (x < (width / 2) + 150) {
			nx = 1;
			//console.log('Here1b',(width / 2) + 100);
		}
	}

	if (y > (height/2) - 25) {
		//console.log('Here2a', (height/2) - 25, (height/2) + 25);
		if (y < (height/2) + 25) {
			ny = 1;
			//console.log('Here2b');
		}
	}

	if (ny != 0 && nx != 0) {
		cont = true;
		console.log('STOP BUTTON PRESSED');
	}	
	
	return cont;
}

function restartSim() {
	loop();	
	p5Time = 0;	
}
	
// When the user clicks the mouse
function mousePressed() {
	// Check if mouse is inside the 
	if (testContinue(mouseX, mouseY)) {

		numAsteroids++;
		if (numAsteroids > maxAsteroids) {
			numAsteroids = maxAsteroids;
		}
		for (var i = 0; i < numAsteroids; i++) {
			asteroids.push(new Asteroid());
		}
		getHUD();
		gameSetup();

		setTimeout(restartSim, 2000);
		
	} else {
		if (testStop(mouseX, mouseY)) {
			// message battle again...
			noLoop();
		}
	}
	
}

function draw() {
	background(0);

	if (asteroids.length == 0) {
		// Continue
		// Draw a rectangle(x,y,w,h)
		background(255);
		background(255, 0, 0);
		background(0);
		noLoop();
		push();
		rectMode(CENTER);
		strokeWeight(2);
		stroke(0, 255, 0);
		fill(0, 255, 0, 127);
		rect((width / 2) - 100, (height / 2), 100, 50, 20);		
		textSize(20);
		noStroke();
		fill(255);
		text('Continue', (width / 2) - 140, (height / 2) + 5);
		
		// Stop
		// Draw a rectangle(x,y,w,h)
		stroke(255, 0, 0);
		fill(255, 0, 0, 127);
		rect((width / 2) + 100, (height / 2), 100, 50, 20);		
		noStroke();
		fill(255);
		text('Stop', (width / 2) + 80, (height / 2) + 5);
		
		pop();
		
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

	
	
	p5DeltaT = deltaTime;
	p5Time += p5DeltaT;
	Engine.update(engine, p5DeltaT);
	gameTimeScale = engine.timing.timeScale;

	if (ship.health <= 0) {	// Stop
		noLoop();
	}
	loopCtr += 1;

	//Display in divHUD
	getHUD();
	
	//Display on canvas
	textSize(32);
	noStroke();
	fill(255);
	text('Score: ' + score, 10, 50);
	text('Shots Fired: ' + shots, 250, 50);
	noStroke();
	fill(255,0,0);
	text('Time: ' + timeSec.toFixed(2), 550, 50);
	

	
	
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

function getHUD() {
	
	//console.log(asteroids.length);
	
	let shootingAverage;
	if (shots != 0) {
		shootingAverage = (score / shots) * 100;
	} else {
		shootingAverage = 0;
	}
	
	timeSec = p5Time / 1000;
	//timeMin = timeSec / 60;
	//timeSec = timeSec % 60;
	
	
	
	let display =  
	'<table> ' +
		'<tr> <td>&nbsp;m_t:</td>  <td>' 
			+ engine.timing.timestamp.toFixed(0) + '</td> </tr>' + 
		'<tr> <td>&nbsp;p5t:</td>  <td>' 
			+ p5Time.toFixed(0) + '</td> </tr>' + 
		'<tr> <td style="color:#77f;">&nbsp;x:</td>    <td>' 
			+ ship.body.position.x.toFixed(0) + '</td> </tr>' +
		'<tr> <td style="color:#77f;">&nbsp;y:</td>    <td>' 
			+ ship.body.position.y.toFixed(0) + '</td> </tr>' +
		'<tr> <td style="color:#0dd;">Asteroids:</td>   <td>' 
			+ asteroids.length + '</td> </tr>' +
		'<tr> <td style="color:#0dd;">Shooting %:</td>   <td>' 
			+ shootingAverage.toFixed(2) + '</td> </tr>' +
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

//ship health bar
function healthBar() {
	var percent = 1 - ship.health;	
	var newWidth = floor((300 * percent) );
	
	if (newWidth > 300) {
		newWidth = 300;
	}

	divHealthBar.style('width', newWidth + 'px');
}

function keyReleased() {
	if (key == 'a') {
		rapid = false;
		//console.log('Key a released');
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
		shots++;
	} else if (key == ' ') {
		lasers.push(new Laser(ship));
		shots++;
	} else if (keyCode == RIGHT_ARROW) {
		ship.setRotation(0.04);
	} else if (keyCode == LEFT_ARROW) {
		ship.setRotation(-0.04);
	} else if (keyCode == UP_ARROW) {
		ship.boost();
	}
}