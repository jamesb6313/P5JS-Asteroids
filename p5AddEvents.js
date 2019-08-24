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
	}	
	
	return cont;
}

function stopGame() {
	noLoop();
	p5Time = 0;
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
	let totalTime = engine.timing.timestamp / 1000;
		
	let display =  
	'<table> ' +
		'<tr> <td>&nbsp;Total Time:</td>  <td>' 
			+ totalTime.toFixed(0) + '</td> </tr>' + 
		'<tr> <td>&nbsp;Level Time:</td>  <td>' 
			+ timeSec.toFixed(0) + '</td> </tr>' + 
		'<tr> <td style="color:255;">&nbsp;Game Level:</td>    <td>' 
			+ gameLevel + '</td> </tr>' +
		'<tr> <td style="color:255;">&nbsp;Game Stage:</td>    <td>' 
			+ gameStage + '</td> </tr>' +
		'<tr> <td style="color:100;">&nbsp;Asteroids Left:</td>   <td>' 
			+ asteroids.length + '</td> </tr>' +
		'<tr> <td style="color:100;">&nbsp;Shooting %:</td>   <td>' 
			+ shootingAverage.toFixed(2) + '</td> </tr>' +
		'<tr> <td style="color:#d0d;">&nbsp;Health :</td>   <td>' 
			+ ship.health.toFixed(2) + '</td> </tr>' +
	'</table>';
	
	divHUD.html(display);
}

function setDomElements() {
	
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
}

/////////
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