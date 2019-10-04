function addEvents(e) {


	// an example of using collisionStart event on an engine
	Events.on(e, 'collisionStart', function(event) {
		var pairs = event.pairs;
		//console.log("Start event : ", e);
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];

						
			let a = pair.bodyA;
			let b = pair.bodyB;
			
			//ship collisions
			if (a.label == 'ship') {
				var hitMass = 1;
				if (b.mass >= 10) {
					hitMass = 10;
				}
				if (b.mass < 0.1) {
					hitMass = 1;
				}
				if (b.label.indexOf("laser") >= 0) {
					hitMass = 5;
				}
				
				ship.collisions(hitMass);
			} else {
				if (b.label == 'ship') {
					var hitMass = 1;
					if (a.mass >= 10) {
						hitMass = 10;
					}
					if (a.mass < 0.1) {
						hitMass = 1;
					}
					if (a.label.indexOf("laser") >= 0) {
						hitMass = 5;
					}
				
					ship.collisions(hitMass);
				}
			}			

			//Asteroid collisions (possible hits)
			if (a.label == 'asteroid') {
				if (b.label.indexOf("laser") >= 0) {
					score = (b.label.indexOf("laser") == 0) ? score + 1: score;
					
					for (var j = asteroids.length - 1; j >= 0; j--) {
						if (a.id == asteroids[j].id) {
							
							if ((asteroids[j].r * 0.5) >= minAsteroidRadius) {
							//if (a.circleRadius >= minAsteroidRadius) {
								asteroids[j].split = true;
							}
							asteroids[j].dead = true;
							break;
						}
					}
					//b.label = "dead";
				}
			} else {
				if (a.label.indexOf("laser") >= 0) {
					if (b.label == 'asteroid') {
						score = (b.label.indexOf("laser") == 0) ? score + 1: score;
						
						for (var j = asteroids.length - 1; j >= 0; j--) {
							if (b.id == asteroids[j].id) {
								
								if ((asteroids[j].r * 0.5) >= minAsteroidRadius) {
								//if (b.circleRadius >= minAsteroidRadius) {
									asteroids[j].split = true;
								}
								asteroids[j].dead = true;							
								break;
							}
						}
						//a.label = "dead";
					}
				}
			}			
			
			//station collisions
			if (a.label == 'station') {
				//console.log('a - station hit');
				var hitMass = 1;
				if (b.mass >= 10) {
					hitMass = 10;
				}
				if (b.mass < 0.1) {
					hitMass = 1;
				}
				if (b.label.indexOf("laser") >= 0) {
					hitMass = 5;
				}
				//console.log('stations.length = ', stations.length);
				//console.log(a,b);
				///
				for (var j = stations.length - 1; j >= 0; j--) {
					if (a.id == stations[j].id) {
						stations[j].collisions(hitMass);
						break;
					}
				}

			} else {
				if (b.label == 'station') {
					//console.log('b - station hit');
					var hitMass = 1;
					if (a.mass >= 10) {
						hitMass = 10;
					}
					if (a.mass < 0.1) {
						hitMass = 1;
					}
					if (a.label.indexOf("laser") >= 0) {
						hitMass = 5;
					}
					//console.log('b - station hit');
					///
					for (var j = stations.length - 1; j >= 0; j--) {
						if (b.id == stations[j].id) {
							stations[j].collisions(hitMass);	
							break;
						}
					}
				
					///				
				}
			}
			
			////
			//orb collisions - (hits by laser)
			if (a.label == 'orb') {
				if (b.label.indexOf("laser") >= 0) {
					console.log('orb hit');
					for (var j = orbs.length - 1; j >= 0; j--) {
						if (a.id == orbs[j].id) {
							orbs[j].maxHits--;
							if (orbs[j].maxHits <= 0) {
								//need to kill of tentacle also
								orbs[j].dead = true;
							}
							break;
						}
					}

				}
			} else {
				if (a.label.indexOf("laser") >= 0) {
					if (b.label == 'orb') {
						console.log('orb hit');
						for (var j = orbs.length - 1; j >= 0; j--) {
							if (b.id == orbs[j].id) {
								orbs[j].maxHits--;
								if (orbs[j].maxHits <= 0) {
									//need to kill of tentacle also
									orbs[j].dead = true;
								}							
								break;
							}
						}
					}
				}
			}
			
			////
			
			//laser collisions
			if (a.label.indexOf("laser") >= 0) {
				a.label = "dead";
			} else {
				if (b.label.indexOf("laser") >= 0) {
					b.label = "dead";
				}
			}
			
			//tentacleSensor collision
			if (a.label == 'tentacleSensor') {
				let sensorFound = false;
				for (var j = tentacles.length - 1; j >= 0; j--) {
					if (a.id == tentacles[j].id) {
						tentacles[j].collisions(1);
						sensorFound = true;
						break;
					}
				}
				
				if (!sensorFound && orbs.length > 0) {
					for (let i = 0; i < orbs.length; i++) {
						if (orbs[i].orbTentacle) {
							if (a.id == orbs[i].orbTentacle.body.id) {
								orbs[i].orbTentacle.collisions(10);
								console.log('orbTentacle health ', orbs[i].orbTentacle.health);
							}
						}
					}
				}
				
				if (b.label == 'ship') {
					ship.collisions(0.01);
				}
			} else {
				let sensorFound = false;
				if (b.label == 'tentacleSensor') {
					for (var j = tentacles.length - 1; j >= 0; j--) {
						if (b.id == tentacles[j].id) {
							tentacles[j].collisions(1);										
							sensorFound = true;
							break;
						}
					}
					if (!sensorFound && orbs.length > 0) {
						for (let i = 0; i < orbs.length; i++) {
							if (orbs[i].orbTentacle) {
								if (b.id == orbs[i].orbTentacle.body.id) {
									orbs[i].orbTentacle.collisions(10);
									console.log('orbTentacle health ', orbs[i].orbTentacle.health);
								}
							}
						}
					}
					
					if (a.label == 'ship') {
						//console.log('tentacle collision');
						ship.collisions(0.01);
					}
				}
			}			
		}
		
		//Extra processing to remove old Asteroids and
		//to split Asteroids upon hit

		//coded here to avoid creating asteroids 
		//on top of each other
		for (var i = asteroids.length - 1; i >= 0; i--) {
			if (asteroids[i].dead) {
				//asteroid.pos should be always = to body.position - needs fixed//
				
				asteroids[i].pos.x = asteroids[i].body.position.x;
				asteroids[i].pos.y = asteroids[i].body.position.y;	
				let numP = floor(random(50, 100));
				//CAN CAUSE ERROR (pressed and held key 'a') - cannot read property  'pos' of undefined
				//line below is the issue ??? was asteroids[j]
				fireworks.push(new Firework(asteroids[i].pos.x, asteroids[i].pos.y, numP));
				//
				if (asteroids[i].split) {
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

		//active collision (e.g. resting contact)
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			let a = pair.bodyA;
			let b = pair.bodyB;
			
			//ship collisions
			if (a.label == 'ship') {
				ship.collisions(0.25);
			} else {
				if (b.label == 'ship') {
					ship.collisions(0.25);
				}
			}
			
			//station collisions
			if (a.label == 'station') {
				for (var j = stations.length - 1; j >= 0; j--) {
					if (a.id == stations[j].id) {
						stations[j].collisions(0.1);	
						break;
					}
				}	
			} else {
				if (b.label == 'station') {	
					for (var j = stations.length - 1; j >= 0; j--) {
						if (b.id == stations[j].id) {
							stations[j].collisions(0.1);	
							break;
						}
					}				
				}
			}
			
			//laser collisions
			if (a.label.indexOf("laser") >= 0) {
				a.label = "dead"
			} else {
				if (b.label.indexOf("laser") >= 0) {
					b.label = "dead"
				}
			}
			
		}
	});

	// an example of using collisionEnd event on an engine
	Events.on(e, 'collisionEnd', function(event) {
		var pairs = event.pairs;

		// change object colours to show those ending a collision
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			let a = pair.bodyA;
			let b = pair.bodyB;
			
			//station collisions finished check health
			if (a.label == 'station') {
				//console.log('a - station collision End');
				for (var j = stations.length - 1; j >= 0; j--) {
 					if (a.id == stations[j].id && stations[j].health <= 0) {
						//
						ship.health += 0.25; //double health
						ship.health = (ship.health > 1) ? 1 : ship.health;
						ship.changeColor();
						
						World.remove(engine.world, stations[j].body);
						stations[j].explode(j);
						break;
					}
				}
			} else {
				if (b.label == 'station') {
					//console.log('b - station collision End');
					for (var j = stations.length - 1; j >= 0; j--) {
						if (b.id == stations[j].id && stations[j].health <= 0) {
							ship.health += 0.25; //double health
							ship.health = (ship.health > 1) ? 1 : ship.health;
							ship.changeColor();
							
							World.remove(engine.world, stations[j].body);
							stations[j].explode(j);
							break;
						}
					}
					
				}
			}
		}
	});
	
	Events.on(e, 'afterUpdate', function(event) {
		//Remove laser.body
		for (var i = lasers.length - 1; i >= 0; i--) {
			if (lasers[i].body.label == 'dead') {								
				World.remove(world, lasers[i].body);
				lasers[i].remove = true;
			}
		}
		
		//Remove laser
 		for (var i = lasers.length - 1; i >= 0; i--) {
			if (lasers[i].remove) {
				lasers.splice(i, 1);
			}
		} 
		
		//Remove tentacle sensor.body
		for (var j = tentacles.length - 1; j >= 0; j--) {
			if (tentacles[j].health <= 0) {
				//let tSensorPos = tentacles[j].sensorPos();
				World.remove(world, tentacles[j].body);										
			}
		}
		
		//Remove tentacle
		for (var j = tentacles.length - 1; j >= 0; j--) {
			if (tentacles[j].health <= 0) {
				tentacles.splice(j, 1);								
			}
		}
		
		//console.log('afterEvent', orbs.length);
		//Remove orb.body & orb tentacle.body
		for (var i = orbs.length - 1; i >= 0; i--) {
			if (orbs[i].dead) {								
				World.remove(world, orbs[i].body);
			}
		}
		
		//Remove orb
 		for (var i = orbs.length - 1; i >= 0; i--) {
			if (orbs[i].dead) {
				orbs.splice(i, 1);
			}
		} 
	});
}