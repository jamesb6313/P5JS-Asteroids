class Laser {
	
	constructor(source) {
		let x,y;
		//this.source = vehicle;
		
		//console.log(source);
		this.remove = false;
		this.speed = 20; //doesn't due much used 12, 20
		this.r = 3;
		
		let laserAngle;
		let myLabel;
		if (source.body.label == 'station') {
			//console.log('station laser');
			
			//Just use top-left & bottom-right corners for shooting
			let tleftX = source.body.position.x - (25 + this.r + 1);
			let tleftY = source.body.position.y - (25 + this.r + 1);
			let brightX = source.body.position.x + (25 + this.r + 1);
			let brightY = source.body.position.y + (25 + this.r + 1);
			
			//determine if ship is above & to left
			if (ship.body.position.x < tleftX) {
				x = tleftX;
				y = tleftY;
			} else {
				if (ship.body.position.y < tleftY) {
					x = tleftX;
					y = tleftY;
				} else {
					x = brightX;
					y = brightY;
				}
			}
			
			laserAngle = atan2(ship.body.position.y - y, ship.body.position.x - x);
			myLabel = 'Stn_laser';
			//console.log('station ', myLabel.indexOf("laser"));
			//console.log(laserAngle);
		} else {
			if (source.body.label == 'orb') {
				
				x = (source.body.position.x + 2) + source.r * cos(source.body.angle);
				y = (source.body.position.y + 2) + source.r * sin(source.body.angle);
				laserAngle = source.body.angle;
				
				
/* 				//rotate to ship then fire - try in addEvents - afterUpdate
				let testAngle = atan2(ship.body.position.y - y, ship.body.position.x - x);
				Body.rotate(source.body, testAngle);
				// */
				myLabel = 'Orb_laser';
				
				console.log('orb laser x, y ', x, y);
			} else {	
				//console.log('ship laser');
				x = (source.body.position.x + 2) + source.r * cos(source.body.angle);
				y = (source.body.position.y + 2) + source.r * sin(source.body.angle);
				laserAngle = source.body.angle;
				myLabel = 'laser';
				//console.log('ship ', myLabel.indexOf("laser"));
			}
		}
		
		const options = {
			friction: 0.0,
			//frictionAir : 0.01,
			restitution: 0,
			angle: laserAngle,
			label: myLabel
		}
		this.body = Bodies.circle(x, y, this.r, options);
		Body.setMass(this.body, this.body.mass * 0.001);
		
		//let group = Body.nextGroup();
		//this.body.collisionFilter.group = group;
		
		if (source.body.label == 'station') {
			//console.log('station laser');
 			Body.setVelocity(this.body, {
				x: this.speed * 0.5 * Math.cos(laserAngle),
				y: this.speed * 0.5 * Math.sin(laserAngle)
			});
		} else {  //Ship & Orb laser
			Body.setVelocity(this.body, {
				x: source.body.velocity.x + this.speed * Math.cos(source.body.angle),
				y: source.body.velocity.y + this.speed * Math.sin(source.body.angle)
			});
		}

		//Matter.Body.setAngularVelocity(this.body, (Math.random() - 0.5) * 1);
		World.add(engine.world, this.body);
	}

	show() {
		const pos = this.body.position;
		const angle = this.body.angle;
		
		push();
		ellipseMode(CENTER);
		translate(pos.x, pos.y);
		rotate(angle);
		strokeWeight(2);
		stroke(255);		//white border
		fill(255, 0, 0);	//red interior
		ellipse(0, 0, this.r * 2, this.r * 2);
		pop();
		//console.log('laser show ', this.body);
	}
		
	offscreen() {
		const pos = this.body.position;
		if (pos.x > width || pos.x < 0) {
			this.body.label = 'dead';
			//this.remove = true; - in addEvents line 371
			return true;
		}
		if (pos.y > height || pos.y < 0) {
			this.body.label = 'dead';
			//this.remove = true; - in addEvents line 371
			return true;
		}
		return false;
	}

}