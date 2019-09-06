class Laser {
	
	constructor(vehicle) {
		let x,y;
		this.source = vehicle;
		
		console.log(this.source);
		this.remove = false;
		this.speed = 20; //doesn't due much used 12, 20
		this.r = 3;
		
		let laserAngle;
		if (this.source.body.label == 'station') {
			console.log('station laser');
			
			//need to determine this
			//Use circle of radius 75 around station as starting position of laser
			x = this.source.body.position.x - 50;
			y = this.source.body.position.y + 2;
			laserAngle = atan2(ship.body.position.y - y, ship.body.position.x - x);

			console.log(laserAngle);
		} else {
			console.log('ship laser');
			x = (this.source.body.position.x + 2) + this.source.r * cos(this.source.body.angle);
			y = (this.source.body.position.y + 2) + this.source.r * sin(this.source.body.angle);
			laserAngle = this.source.body.angle;		
		}
		
		const options = {
			friction: 0.0,
			//frictionAir : 0.01,
			restitution: 0,
			angle: laserAngle,
			label: "laser"
		}
		this.body = Bodies.circle(x, y, this.r, options);
		Body.setMass(this.body, this.body.mass * 0.001);
		
		//let group = Body.nextGroup();
		//this.body.collisionFilter.group = group;
		
		if (this.source.body.label == 'station') {
			console.log('station laser');
 			Body.setVelocity(this.body, {
				x: this.speed * Math.cos(laserAngle),
				y: this.speed * Math.sin(laserAngle)
			});
		} else {
			console.log('ship laser');
			Body.setVelocity(this.body, {
				x: this.source.body.velocity.x + this.speed * Math.cos(this.source.body.angle),
				y: this.source.body.velocity.y + this.speed * Math.sin(this.source.body.angle)
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
		console.log('laser show ', this.body);
	}
		
	offscreen() {
		const pos = this.body.position;
		if (pos.x > width || pos.x < 0) {
			this.body.label = 'dead';
			this.remove = true;
			return true;
		}
		if (pos.y > height || pos.y < 0) {
			this.body.label = 'dead';
			this.remove = true;
			return true;
		}
		return false;
	}

}