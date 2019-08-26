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
		setHUD();
		//setDomElements()();

		setTimeout(restartSim, 2000);
		
	} else {
		if (testStop(mouseX, mouseY)) {
			// message battle again...
			noLoop();
			p5Time = 0;
		}
	}
	
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
		ship.setRotation(0.1);
		ship.boosting(false);
		lasers.push(new Laser(ship));
		shots++;
	} else if (key == ' ') {
		lasers.push(new Laser(ship));
		shots++;
	} else if (keyCode == RIGHT_ARROW) {
		ship.setRotation(0.03);
	} else if (keyCode == LEFT_ARROW) {
		ship.setRotation(-0.03);
	} else if (keyCode == UP_ARROW) {
		ship.boost();
	}
}

/* function keyIsDown() {		//try again used KeyDown() before and s/b KeyIsDown
	if (keyCode == RIGHT_ARROW) {
		ship.setRotation(0.01);
	} else if (keyCode == LEFT_ARROW) {
		ship.setRotation(-0.01);
	}
} */

function testContinue(x, y) {
	// rect((width / 2) - 100, (height / 2), 100, 50, 20);
	let nx = 0; 
	let ny = 0;
	let cont = false;
	
	if (x > (width / 2) - 150) {
		if (x < (width / 2) - 50) {
			nx = 1;
		}
	}

	if (y > (height/2) - 25) {
		if (y < (height/2) + 25) {
			ny = 1;
		}
	}

	if (ny != 0 && nx != 0) {
		cont = true;
	}	
	
	return cont;
}

function testStop(x, y) {
	//rect((width / 2) + 100, (height / 2), 100, 50, 20);	
	let nx = 0; 
	let ny = 0;
	let cont = false;
	
	if (x > (width / 2) + 50) {
		if (x < (width / 2) + 150) {
			nx = 1;
		}
	}

	if (y > (height/2) - 25) {
		if (y < (height/2) + 25) {
			ny = 1;
		}
	}

	if (ny != 0 && nx != 0) {
		cont = true;
	}	
	
	return cont;
}

function restartSim() {
	loop();
	p5Time = 0;
	deltaTime = 0;
	p5DeltaT = 0;
	gamePause = false;
}
	

function drawContinueButton(){
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
	pop();
}

function drawStopButton() {
	push();
	rectMode(CENTER);
	strokeWeight(2);
	stroke(255, 0, 0);
	fill(255, 0, 0, 127);
	rect((width / 2) + 100, (height / 2), 100, 50, 20);		
	
	textSize(20);	
	noStroke();
	fill(255);
	text('Stop', (width / 2) + 80, (height / 2) + 5);
	pop();
}

function setHUD() {	

	let shootingAverage;
	if (shots != 0) {
		shootingAverage = (score / shots) * 100;
	} else {
		shootingAverage = 0;
	}
	
	let healthPct = 0;	//want remaining health 1 - x
	healthPct = (1 - ship.health) * 100;
	
	timeSec = p5Time / 1000;
	//timeMin = timeSec / 60;
	//timeSec = timeSec % 60;
	let totalTime = engine.timing.timestamp / 1000;
	
	
	domGameTime.html(totalTime.toFixed(0));
	domLevelTime.html(timeSec.toFixed(0));;
	domGameLevel.html(gameLevel);
	domGameStage.html(gameStage);
	domAsteroidsLeft.html(asteroids.length);
	domShootingPercent.html(shootingAverage.toFixed(2));
	domShipsHealthBar.style('width: ' + healthPct.toFixed(0) + '%');
	domShipsHealthVal.html(healthPct.toFixed(2) + '%');
}

//DOM stop button callback
function stopGame() {
	noLoop();
	p5Time = 0;
}

function setCanvasDisplay() {
	textSize(32);
	noStroke();
	fill(255);
	text('Score: ' + score, 10, 50);
	text('Shots Fired: ' + shots, 250, 50);
	noStroke();
	fill(255,0,0);
	text('Time: ' + timeSec.toFixed(2), 550, 50);
}