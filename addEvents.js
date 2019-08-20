function addEvents(e) {
	// an example of using collisionStart event on an engine
	Events.on(e, 'collisionStart', function(event) {
		var pairs = event.pairs;
		//console.log("Start event : ", e);
		// change object colours to show those starting a collision
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];

						
			let a = pair.bodyA;
			let b = pair.bodyB;
			
			//ship collisions
			if (a.label == 'ship') {
				var hitMass = 1;
				if (b.mass >= 5) {
					hitMass = 5;
				}
				if (b.mass < 0.1) {
					hitMass = 0.1;
				}
				
				ship.health -= (ship.deltaHealth * hitMass);
				ship.changeColor();
			} else {
				if (b.label == 'ship') {
					var hitMass = 1;
					if (a.mass >= 5) {
						hitMass = 5;
					}
					if (a.mass < 0.1) {
						hitMass = 0.1;
					}
				
					ship.health -= (ship.deltaHealth * hitMass);	
					ship.changeColor();
				}
			}			

			//Asteroid collisions (possible hits)
			if (a.label == 'asteroid') {
				//console.log("1 a.label ", a);
				if (b.label == 'laser') {
					//console.log("1 b.label ", b);
					score++;
					for (var i = asteroids.length - 1; i >= 0; i--) {
						if (a.id == asteroids[i].id) {
							
							if (a.circleRadius >= 10) {
								asteroids[i].split = true;
							}
							asteroids[i].dead = true;
							//console.log(asteroids[i]);
							break;
						}
					}
					b.label = "dead";
				}
			} else {
				if (a.label == 'laser') {
					if (b.label == 'asteroid') {
					//console.log("2 b.label ", b);
					score++;
					//console.log(b.id);
					for (var i = asteroids.length - 1; i >= 0; i--) {
						if (b.id == asteroids[i].id) {
							
							if (b.circleRadius >= 10) {
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
		
		
		//console.log('starting breakup()');
		for (var i = asteroids.length - 1; i >= 0; i--) {
			if (asteroids[i].dead) {
				
				if (asteroids[i].split) {
					//console.log('body', asteroids[i].body.position);
					//console.log('this.pos', asteroids[i].pos);
					asteroids[i].pos.x = asteroids[i].body.position.x;
					asteroids[i].pos.y = asteroids[i].body.position.y;
					
					World.remove(engine.world, asteroids[i].body);
					var newAsteroids = asteroids[i].breakup();								
					asteroids = asteroids.concat(newAsteroids);
				}
				
				removeAsteroids = true;
				World.remove(engine.world, asteroids[i].body);
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
	
	Events.on(e, 'afterUpdate', function(event) {
		//console.log('afterUpdate');
		for (var i = lasers.length - 1; i >= 0; i--) {
			if (lasers[i].body.label == 'dead') {								
				World.remove(world, lasers[i].body);
				lasers[i].remove = true;
			}
		}
		
 		for (var i = lasers.length - 1; i >= 0; i--) {
			if (lasers[i].remove) {
				lasers.splice(i, 1);
			}
		} 
		
	});
}