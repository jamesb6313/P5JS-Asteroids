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

let ship;
let stations = [];
let numStations = 1;
let asteroids = [];
let numAsteroids = 5;
let maxAsteroids = 7;
let lasers = [];

let tentacles = [];
let numSegs = 10;
let segLength = 20;

let rapid = false;
let removeAsteroids = false;
let rapidStart = 0;
let loopCtr = 0;
let shipRadius = 30;
let minAsteroidRadius = 7;		//line48 addEvents.js

let domGameRules;
let domDisplayRules;
let domGameStop;
let domGameTime;
let domLevelTime;
let domGameLevel;
let domGameStage;
let domAsteroidsLeft;

let domShootingBar;
let domShootingVal;

let domShipsHealthBar;
let domShipsHealthVal

let score = 0;
let shots = 0;
let time = 0;
let timeSec = 0;
let timeMin = 0;
let gameTimeScale = 1;
let gameLevel = 1;
let gameStage = 1;

let gamePause = false;
let gameOver = false;
let displayGameRules = false;
let rulesPause = false;

let fireworks = [];

let world, engine;
let p5DeltaT = 0;
let p5Time = 0;
//let pauseTime = 0;

let canvas;

function setup() {
	canvas = createCanvas(800, 500); //(windowWidth, windowHeight);
	

	engine = Engine.create();
	world = engine.world;
	
	console.log("world", world);
		
	world.gravity.y = 0;
	world.gravity.x = 0;
		
	// set game variables
	p5Time = 0;	
	
	addEvents(engine);
	let shipPos = createVector(width/2,height/2);
	ship = new Ship(shipPos, shipRadius, 0);	
	

	//Start game off since all other levels will use setupGameLevel()
	for (let i = 0; i < numAsteroids; i++) {
		asteroids.push(new Asteroid());
	}

/* 	stations.push(new Station(width - 100, height / 2, 50, 50));
	tentacles.push(new Tentacle(width /4, height, numSegs));
	tentacles.push(new Tentacle(width /2, height, numSegs/2));
	tentacles.push(new Tentacle(3*(width /4), height, numSegs));
	
	
	for (let i = 0; i < numAsteroids; i++) {
		asteroids.push(new Asteroid());
	}
	*/
	
	//get DOM elements for displaying Game Statistics
	domGameRules = select('#game_info_rules');
	domDisplayRules = select('#displayRules');
	domDisplayRules.mouseReleased(displayInfo_Rules);
	
	domHUDtable = select('#HUDtable');
	domHUDtable.position(0, height + 10);
	
	domGameStop = select('#gameStop');
	domGameStop.mouseReleased(stopGame);
	
	domGameTime = select('#gameTime');
	domLevelTime = select('#levelTime');
	domGameLevel = select('#gameLevel');
	domGameStage = select('#gameStage');
	domAsteroidsLeft = select('#asteroidsLeft');
	
	domShootingBar =select('#barShooting');
	domShootingVal =select('#perShooting');
	
	domShipsHealthBar = select('#barHealth');
	domShipsHealthVal = select('#perHealth');

//gameStage = 2;
}

function draw() {
	background(0);
	
	if (gamePause) {
		console.log('INSIDE gamePause');
		gameLevel++;

		if (gameLevel > 5) {
			gameStage++;
			gameLevel = 1;
		}
		if (gameStage > 3) {
			gameStage = 3;
		}
		setupGameLevel();
/* this happens in restartSim() ln 112 p5AddEvents
 		deltaTime = 0;
		p5DeltaT = 0; */
	}


	p5DeltaT = deltaTime;
	p5Time += p5DeltaT;

	//console.log(', deltaTime = ', deltaTime.toFixed(2), ', p5Time = ', p5Time.toFixed(2));
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
	}
	
	if (frameCount % 10) {
		//console.log('number of bodies ; ', world.bodies.length);
		if (removeAsteroids) {
			for (let i = asteroids.length - 1; i >= 0; i--) {
				if (asteroids[i].body.label == 'asteroidDebris') {
					Body.scale(asteroids[i].body, asteroids[i].parentR, asteroids[i].parentR);
					asteroids[i].r = asteroids[i].parentR * 0.5;
					//asteroids[i].body.circleRadius = asteroids[i].r;
					asteroids[i].body.label = 'asteroid';
					asteroids[i].scaleUp();
					asteroids[i].show();
					//console.log('Debris', asteroids[i].body);
				}
			}
			removeAsteroids = false;
		}
	}

	//console.log('BEFORE gameOver & ship.health checks');
	if (ship.health <= 0 || gameOver) {
		console.log('INSIDE gameOver & ship.health checks');		
		gameOverDisplay();
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

	for (let i = 0; i < stations.length; i++) {
		stations[i].show();
	}
	ship.edges();
	ship.show();
	
	//console.log(tentacles.length);
	for (let i = 0; i < tentacles.length; i++) {
        let t = tentacles[i];
        t.update();
        t.show();
    }
	/* let endPoint = tentacles[0].endPointPos();
	
	if (ship.body.position.x >= endPoint.x - 2 &&
		ship.body.position.x <= endPoint.x + 2 &&
		ship.body.position.y >= endPoint.y - 2 &&
		ship.body.position.y <= endPoint.y + 2) {	
		
		console.log('contact');
	} */
	
	for (let i = fireworks.length - 1; i >= 0; i--) {
		
		fireworks[i].update();
		fireworks[i].show();
		if (fireworks[i].done()) {
			fireworks.splice(i, 1);
		}		
	}
  
}

function laserFire() {
	for (let i = lasers.length - 1; i >= 0; i--) {
		lasers[i].show();
	}
}

function laserEndCycle() {
	for (let i = lasers.length - 1; i >= 0; i--) {
		lasers[i].offscreen();
	}
}

function setupGameLevel() {
	
	console.log(gameLevel, gameStage);
	switch(gameStage) {
		case 1:
			for (let i = 0; i < numAsteroids; i++) {
				asteroids.push(new Asteroid());
			}
			if (gameLevel == 5) {
				stations.push(new Station(width - 100, height / 2, 50, 50));
			}
			break;
		case 2:
			for (let i = 0; i < numAsteroids + 1; i++) {
				asteroids.push(new Asteroid());
			}
			switch(gameLevel) {
				case 1:
					if (stations.length == 0) {
						stations.push(new Station(width - 100, height / 2, 50, 50));
					}
					break;
				default:
					if (stations.length == 0) {
						stations.push(new Station(width - 100, height / 2, 50, 50));
						stations.push(new Station(100, height / 2, 50, 50));
					} else {
						if (stations.length == 1) {
							
							if (stations[0].x == 100) {
								stations.push(new Station(width - 100, height / 2, 50, 50));
							} else {
								stations.push(new Station(100, height / 2, 50, 50));
							}
						}
					}
			}
			break;
		case 3:
			//Remove tentacle sensor.body
			for (var j = tentacles.length - 1; j >= 0; j--) {
				if (tentacles[j].health <= 0) {
					World.remove(world, tentacles[j].body);										
				}
			}
			
			//Remove tentacle
			for (var j = tentacles.length - 1; j >= 0; j--) {
				if (tentacles[j].health <= 0) {
					tentacles.splice(j, 1);								
				}
			}
			
			// Create new tentacles each level
			tentacles.push(new Tentacle(width /4, height, numSegs));
			tentacles.push(new Tentacle(width /2, height, numSegs/2));
			tentacles.push(new Tentacle(3*(width /4), height, numSegs));
			
			for (let i = 0; i < numAsteroids + 2; i++) {
				asteroids.push(new Asteroid());
			}
			switch(gameLevel) {
				case 1:
					if (stations.length == 0) {
						stations.push(new Station(width - 100, height / 2, 50, 50));
					}
					break;
				default:
					//let curStationNum = stations.length;
					if (stations.length == 0) {
						stations.push(new Station(width - 100, height / 2, 50, 50));
						stations.push(new Station(100, height / 2, 50, 50));
					} else {
						if (stations.length == 1) {
							
							if (stations[0].x == 100) {
								stations.push(new Station(width - 100, height / 2, 50, 50));
							} else {
								stations.push(new Station(100, height / 2, 50, 50));
							}
						}
					}
			}
			break;

		}
}