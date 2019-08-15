function addEvents(e) {
	// an example of using collisionStart event on an engine
	Events.on(e, 'collisionStart', function(event) {
		var pairs = event.pairs;

		// change object colours to show those starting a collision
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			//pair.bodyA.render.fillStyle = '#333';
			//pair.bodyB.render.fillStyle = '#333';
			console.log("collisionStart");
		}
	});

	// an example of using collisionActive event on an engine
	Events.on(e, 'collisionActive', function(event) {
		var pairs = event.pairs;

		// change object colours to show those in an active collision (e.g. resting contact)
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			//pair.bodyA.render.fillStyle = '#333';
			//pair.bodyB.render.fillStyle = '#333';
			console.log("collisionActive");
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
			console.log("collisionEnd");
		}
	});
}