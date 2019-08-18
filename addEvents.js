function addEvents(e) {
	// an example of using collisionStart event on an engine
	Events.on(e, 'collisionStart', function(event) {
		var pairs = event.pairs;
		console.log("Start event : ", e);
		// change object colours to show those starting a collision
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];

						
			let a = pair.bodyA;
			let b = pair.bodyB;
			
			//ship collisions
			if (a.label == 'ship') {
				ship.health -= ship.deltaHealth;				
				ship.changeColor();
				//console.log(ship);
				//console.log("a is ship collisionStart");
			} else {
				if (b.label == 'ship') {
					ship.health -= ship.deltaHealth;					
					ship.changeColor();
					//console.log(ship);
					//console.log("b is ship collisionStart");
				}
			}			

			//Asteroid collisions (possible hits)
			if (a.label == 'asteroid') {
				console.log("1 a.label ", a);
				if (b.label == 'laser') {
					console.log("1 b.label ", b);
					score++;
					console.log(a.id);
					for (var i = asteroids.length - 1; i >= 0; i--) {
						if (a.id == asteroids[i].id) {
							
							if (a.circleRadius > 10) {
								asteroids[i].split = true;
							}
							asteroids[i].dead = true;
							break;
						}
					}
					b.label = "dead";
				}
			} else {
				if (a.label == 'laser') {
					if (b.label == 'asteroid') {
					console.log("2 b.label ", b);
					score++;
					console.log(b.id);
					for (var i = asteroids.length - 1; i >= 0; i--) {
						if (b.id == asteroids[i].id) {
							
							if (b.circleRadius > 10) {
								asteroids[i].split = true;
							}
							asteroids[i].dead = true;
							break;
						}
					}
					a.label = "dead";
					}
				}
			}			
			
			//laser collisions
			if (a.label == 'laser') {
				a.label = "dead";
			} else {
				if (b.label == 'laser') {
					b.label = "dead";
				}
			}
		}
		
		
		console.log('starting breakup()');
		for (var i = asteroids.length - 1; i >= 0; i--) {
			if (asteroids[i].dead) {
				
				if (asteroids[i].split) {
					console.log("dead Asteroid", asteroids[i]);
					World.remove(engine.world, asteroids[i].body);
					var newAsteroids = asteroids[i].breakup();								
					asteroids = asteroids.concat(newAsteroids);
				}
				removeAsteroids = true;
				asteroids.splice(i, 1);
			}
		}
		
	});
	
	// an example of using collisionActive event on an engine
	Events.on(e, 'collisionActive', function(event) {
		var pairs = event.pairs;

		// change object colours to show those in an active collision (e.g. resting contact)
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			let a = pair.bodyA;
			let b = pair.bodyB;
			if (a.label == 'ship') {
				ship.health -= (ship.deltaHealth * 0.05);				
				ship.changeColor();
			} else {
				if (b.label == 'ship') {
					ship.health -= (ship.deltaHealth * 0.05);					
					ship.changeColor();
				}
			}
			
			//laser collisions
			if (a.label == 'laser') {
				a.label = "dead"
			} else {
				if (b.label == 'laser') {
					b.label = "dead"
				}
			}
			
			//console.log("collisionActive", lasers);
		}
	});

	// an example of using collisionEnd event on an engine
	Events.on(e, 'collisionEnd', function(event) {
		var pairs = event.pairs;

		// change object colours to show those ending a collision
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			//console.log("collisionEnd");
		}
	});
}