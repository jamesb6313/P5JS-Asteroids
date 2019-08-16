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
var shipRadius = 50;
var divHUD;

var score;
var hits;

let world, engine;
var display;
let p5DeltaT,p5Time;
	
	
function setup() {
	const canvas = createCanvas(800, 600); //(windowWidth, windowHeight);


	
	engine = Engine.create();
	world = engine.world;
	world.gravity.y = 0;

	divHealth = createDiv("").size(300,20);
	divHealth.style('text-align', 'center');
	divHealth.style('background-color', color(200));
	divHealth.style('width', '70%');
	divHealth.html('HEALTH')
	//divHealth.addClass('w3-red');
	
	divHUD = createDiv("").size(300,160);

	p5Time = 0;
	//display = '<tr> <td>&nbsp;t:</td>    <td>' + engine.timing.timestamp.toFixed(0) + '</td> </tr>' + '</table>';
	
	//divHUD.html(display);
	
	
	
	addEvents(engine);

	ship = new Ship(width/2,height/2, shipRadius, 0);	
	mybox = new Box(width - 100, height / 2, 50, 50);
	

	for (var i = 0; i < 1; i++) {
		asteroids.push(new Asteroid());
	}

	//avoid making Asteroid on ship
	
	textSize(32);
	score = 0;
	hits = 0;
	//Engine.run(engine);
	

}
	

function draw() {
	// put drawing code here
	background(0);
	
/* 	if (frameCount > 3000) {
		console.log("the frameRate", frameRate());
		noLoop();
	} */


	display =  '<table> ' +
		'<tr> <td>&nbsp;m_t:</td>  <td>' + engine.timing.timestamp.toFixed(0) + '</td> </tr>' + 
		'<tr> <td>&nbsp;p5t:</td>  <td>' + p5Time.toFixed(0) + '</td> </tr>' + 
	    '<tr> <td style="color:#77f;">&nbsp;x:</td>    <td>' + ship.body.position.x.toFixed(0) + '</td> </tr>' +
        '<tr> <td style="color:#77f;">&nbsp;y:</td>    <td>' + ship.body.position.y.toFixed(0) + '</td> </tr>' +
		'<tr> <td style="color:#0dd;">Vx:</td>   <td>' + ship.body.velocity.x.toFixed(2) + '</td> </tr>' +
        '<tr> <td style="color:#0dd;">Vy:</td>   <td>' + ship.body.velocity.y.toFixed(2) + '</td> </tr>' +
        '<tr> <td style="color:#d0d;">H :</td>   <td>' + ship.health.toFixed(2) + '</td> </tr>' +
	'</table>';
	var col = color(0,255,0);
	divHUD.style('background-color', col);
	divHUD.html(display);
	p5DeltaT = deltaTime;
	p5Time += p5DeltaT;
		
	//col = color(255);
	//divHealth.style('background-color', col);

	
	
	Engine.update(engine, p5DeltaT);

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
	}*/
	
	laserEndCycle();
	laserFire();

	mybox.show();
	ship.edges();
	//ship.changeColor();
	ship.show();
	healthBar();

}

function healthBar() { // player health bar
	var percent = ship.health * 100;

	//divHealth.style('width', '25%');
	console.log(percent.toFixed(0));
	
	/* var size = 200;
	var x = divHealth.x + 6;
	var y = height + divHealth.y + 6;
	var col1 = color(255,85,119,0.3);
	
	fill(col1);
	rect(x, y, size, 10);
	
	col1 = color(255, 85, 119, 0.9);
	fill(col1);
	rect(x, y, size * ship.health, 10); */
	//console.log(divHealth);
	
}

function laserFire() {
	for (var i = lasers.length - 1; i >= 0; i--) {
		lasers[i].show();
		//lasers[i].update();
			
		
		/*else { 
		
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
		}*/
	}
}

function laserEndCycle() {
	for (var i = lasers.length - 1; i >= 0; i--) {
		if (lasers[i].offscreen()) {
			Matter.World.remove(engine.world, lasers[i].body);
			lasers.splice(i, 1);
		} else { 
			if (lasers[i].body.label == "dead") {
				Matter.World.remove(engine.world, lasers[i].body);
				lasers.splice(i, 1);			
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