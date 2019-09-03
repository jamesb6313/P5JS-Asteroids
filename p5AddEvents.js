// When the user clicks the mouse
function mousePressed() {
	// Check if mouse is inside the 
	if (gamePause  && !gameOver) {
		if (testContinue(mouseX, mouseY)) {

			numAsteroids++;
			if (numAsteroids > maxAsteroids) {
				numAsteroids = maxAsteroids;
			}
			for (var i = 0; i < numAsteroids; i++) {
				asteroids.push(new Asteroid());
			}
			setHUD();

			setTimeout(restartSim, 2000);
			
		} else {
			if (testStop(mouseX, mouseY)) {
				// message battle again...
				console.log('mousePressed TestStop');
				gameOver = true;
				loop();
			}
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
/* 
function keyIsDown() {
	if (keyCode == RIGHT_ARROW) {
		ship.setRotation(0.01);
	} else if (keyCode == LEFT_ARROW) {
		ship.setRotation(-0.01);
	}
} 

//DO SOMETHING 99% of the time
	var r = random(100);
	if (r < 1) {
	}
*/

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
	let stop = false;
	
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
		stop = true;
	}	
	
	return stop;
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

function disTimeMinSec(t) {
	let disTime = 0;
	if (t > 60) {
		let timeMin = floor(t / 60);
		let remainingSec = floor(t % 60);

		if (remainingSec > 0 && remainingSec < 10) {
			remainingSec = '0' + remainingSec;
		}
		
		disTime = timeMin + ' : ' +
			remainingSec;
	} else {
		t = floor(t);
/* 		if (t > 0 && t < 10) {
			t = '0' + t;
		} */
		disTime = t;
	}
	return disTime;
}

function setHUD() {	

	let shootingAverage;
	if (shots != 0) {
		shootingAverage = (score / shots) * 100;
	} else {
		shootingAverage = 0;
	}
	
	let healthPct = 0;
	healthPct = (ship.health) * 100;
	if (healthPct <= 0) {
		healthPct = 0.00;
	}
	
	timeSec = p5Time / 1000;
	let disLevelTime = disTimeMinSec(timeSec);		
	
	let totalTime = engine.timing.timestamp / 1000;
	let disGameTime = disTimeMinSec(totalTime);
	
	domGameTime.html(disGameTime);
	domLevelTime.html(disLevelTime);
	domGameLevel.html(gameLevel);
	domGameStage.html(gameStage);
	domAsteroidsLeft.html(asteroids.length);
	
	domShootingBar.style('width: ' + shootingAverage.toFixed(0) + '%;');
	domShootingVal.html(shootingAverage.toFixed(2) + '%');
	
	domShipsHealthBar.style('width: ' + healthPct.toFixed(0) + '%;');
	domShipsHealthVal.html(healthPct.toFixed(2) + '%');
}

//DOM stop button callback
function stopGame() {
	gameOver = true;
}

//DOM stop button callback
function displayInfo_Rules() {

	if (displayGameRules == false) {		
		displayGameRules = true;
		domGameRules.style('display : block;');
		domDisplayRules.html('Hide Rules');
		noLoop();
	} else {		
		displayGameRules = false;
		domGameRules.style('display: none;');
		domDisplayRules.html('Show Rules');
		loop();
	}
}

function gameOverDisplay() {
	
/* 	push();
	rectMode(CENTER);

	
	strokeWeight(2);
	stroke(255, 255, 0);
	fill(0, 255, 255);
	rect(width / 2, height / 2, 600, 300, 20);	
	
	textSize(62);
	noStroke();
	fill(255,255,0);
	text('Game Over', width / 2 - 150, height / 2 - 50);
	text('Thanks for Playing', width / 2 - 250, height / 2 + 50);
	pop(); */
	domGameRules.html('<h1><strong> GAME OVER - Thanks for Playing' +
		'</strong><h1>');
	domGameRules.style('display: block;');
	//domGameRules.style('padding: 350px 0;');
}

function setCanvasDisplay() {
	textSize(32);
	noStroke();
	fill(255);
	text('Score: ' + score, 10, 50);
	text('Shots Fired: ' + shots, 250, 50);
	
	timeSec = p5Time / 1000;
	let disLevelTime = disTimeMinSec(timeSec);	
	noStroke();
	fill(255,0,0);
	text('Time: ' + disLevelTime, 550, 50);
}