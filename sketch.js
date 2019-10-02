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

let orbs = [];

let tentacles = [];
//let numSegs = 10;
let segLength = 15;

let rapid = false;
let removeAsteroids = false;
let rapidStart = 0;
let loopCtr = 0;
let shipRadius = 30;
let minAsteroidRadius = 7;		//line48 addEvents.js
let fireRate;

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
let val;

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


let debugging = false; //true;
	if (debugging == true) {
		gameStage = 3;
		gameLevel = 3;
		setupGameLevel();
	}
	
	if (gameStage == 1 && gameLevel == 1) {
		//Start game off since 
		//all other levels will use setupGameLevel()
		for (let i = 0; i < numAsteroids; i++) {
			asteroids.push(new Asteroid());
		}
	}

	val = createVector(floor(random(0,width)), floor(random(0, height)) );	
}



function draw() {
	background(0);
		
	if (gamePause) {
		//console.log('INSIDE gamePause');
		gameLevel++;

		if (gameLevel > 5) {
			gameStage++;
			gameLevel = 1;
		}
		setupGameLevel();
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
		
		// Display Stage & Level just completed
		drawStageLevel();
		
		// Continue
		drawContinueButton();
		
		// Stop
		drawStopButton();
	}
	
	if (frameCount % 10 == 0) {
		
		//if (frameCount % 10000 == 0) {
			val = createVector(floor(random(0,width)), floor(random(0, height)) );
			//console.log('val = ', val, ' frameCount = ', frameCount);
		//}
		
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
		
		//Get Station Firing at Ship
		if (gameStage > 2 && gameLevel > 2) {
			if (stations.length > 0 && random(0, 1) < fireRate) {
				lasers.push(new Laser(stations[0]));
			}
		}
	}

	//console.log('BEFORE gameOver & ship.health checks');
	if (ship.health <= 0 || gameOver) {
		//console.log('INSIDE gameOver & ship.health checks');		
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
	
	for (let i = 0; i < orbs.length; i++) {
		orbs[i].show();
		orbs[i].edges();
	}
	
	ship.edges();
	ship.show();
	
	//console.log(tentacles.length);
	for (let i = 0; i < tentacles.length; i++) {
        let t = tentacles[i];
		if (ship.body.position.y > height / 2) {
			if (t.orbType) {
				t.update(orbs[0].x,orbs[0].y,ship.body.position.x, ship.body.position.y);
			} else {
				t.update(t.base.x,t.base.y,ship.body.position.x, ship.body.position.y);
			}
		} else {
			//let val = createVector(floor(random(0,width)), floor(random(0, height)) );
			if (t.orbType) {
				t.update(orbs[0].x,orbs[0].y,ship.body.position.x, ship.body.position.y);
			} else {
				t.update(t.base.x,t.base.y,val.x, val.y);
			}
		}
        t.show();
    }
	
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
	
	//console.log(gameLevel, gameStage);
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
			
			let orbPos = { x: random(0, width) , y: random(0, height) }
			orbs.push(new Orb(orbPos.x, orbPos.y));
			tentacles.push(new Tentacle(orbPos.x, orbPos.y, floor(random(5,15)), true ));
			
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
			let numTentacles = floor(random(3,10));
			for (let i = 0; i < numTentacles; i++) {
				let horPos = random(50, width - 50);
				let numSegs = floor(random(5,15));
				if (random(0, 1) > 0.05) {
					tentacles.push(new Tentacle(horPos, height, numSegs, false ));
				} else {
					tentacles.push(new Tentacle(horPos, 0, numSegs, false  ));
				}
			}
			
			for (let i = 0; i < numAsteroids + 2; i++) {
				asteroids.push(new Asteroid());
			}
			switch(gameLevel) {
				case 1:
/* 					if (stations.length == 0) {
						stations.push(new Station(width - 100, height / 2, 50, 50));
					}
					break; */
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
	
	if (stations.length > 0) {
		fireRate = 3 * random(0, 0.005); //gameStage * gameLevel * random(0, 0.005);
	}
}