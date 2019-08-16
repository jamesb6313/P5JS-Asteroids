function addEvents(e) {
	// an example of using collisionStart event on an engine
	Events.on(e, 'collisionStart', function(event) {
		var pairs = event.pairs;

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
			
			//laser collisions
			if (a.label == 'laser') {
				a.label = "dead"
			} else {
				if (b.label == 'laser') {
					b.label = "dead"
				}
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
				//console.log(ship);
				//console.log("a is ship collisionActive");
			} else {
				if (b.label == 'ship') {
					ship.health -= (ship.deltaHealth * 0.05);					
					ship.changeColor();
					//console.log(ship);
					//console.log("b is ship collisionActive");
				}
			}
			
			//laser collisions
			if (a.label == 'laser') {
				a.label = "dead"
				//Matter.World.remove(engine.world, a);
			} else {
				if (b.label == 'laser') {
					b.label = "dead"
					//Matter.World.remove(engine.world, b);
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
			//pair.bodyA.render.fillStyle = '#222';
			//pair.bodyB.render.fillStyle = '#222';
			//console.log("collisionEnd");
		}
	});
}