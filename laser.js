class Laser {
	
	constructor(ship) {
		let x,y;
		
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
			//collisionFilter.group: 2
		}
		this.body = Bodies.circle(x, y, this.r, options);
		Body.setMass(this.body, this.body.mass);
		World.add(world, this.body);
		//console.log(this.body);
		
		//let group = Body.nextGroup();
		//this.body.collisionFilter.group = group;
		
		//
		Body.setVelocity(this.body, {
			x: ship.body.velocity.x + this.speed * Math.cos(ship.body.angle),
			y: ship.body.velocity.y + this.speed * Math.sin(ship.body.angle)
		});
		Matter.Body.setAngularVelocity(this.body, (Math.random() - 0.5) * 1);
		World.add(engine.world, this.body);
		
		//
	}

	show() {
		const pos = this.body.position;
		const angle = this.body.angle;
		
		push();
		translate(pos.x, pos.y);
		rotate(angle);
		//noFill();
		stroke(225);
		strokeWeight(2);
		circle(0, 0, this.r * 2, this.r * 2);
		//point(0,0);
		pop();
	}
	
	/* this.hits = function(asteroid) {
		var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
		if (d < asteroid.r) {
			return true;
		} else {
			return false;
		}
	}*/
	
		
	offscreen() {
		const pos = this.body.position;
		if (pos.x > width || pos.x < 0) {
			return true;
		}
		if (pos.y > height || pos.y < 0) {
			return true;
		}
		return false;
	}

}