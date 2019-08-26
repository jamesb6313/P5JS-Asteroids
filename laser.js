class Laser {
	
	constructor(ship) {
		let x,y;
		
		this.remove = false;
		this.speed = 9;
		this.r = 3;
		x = (ship.body.position.x + 2) + ship.r * cos(ship.body.angle);
		y = (ship.body.position.y + 2) + ship.r * sin(ship.body.angle);
		
		const options = {
			friction: 0.0,
			frictionAir : 0.01,
			restitution: 0,
			angle: ship.body.angle,
			label: "laser"
		}
		this.body = Bodies.circle(x, y, this.r, options);
		Body.setMass(this.body, this.body.mass * 0.01);
		
		//let group = Body.nextGroup();
		//this.body.collisionFilter.group = group;
		
		Body.setVelocity(this.body, {
			x: ship.body.velocity.x + this.speed * Math.cos(ship.body.angle),
			y: ship.body.velocity.y + this.speed * Math.sin(ship.body.angle)
		});
		Matter.Body.setAngularVelocity(this.body, (Math.random() - 0.5) * 1);
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