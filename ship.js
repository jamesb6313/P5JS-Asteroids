class Ship {

	constructor(x, y, r, a) {
		const deltaHealth = 0.05;
		this.health = 1;

		const options = {
			friction: 0.0,
			frictionAir : 0.01,
			restitution: 0.3,
			angle: a
			//collisionFilter: 0x0002
		}
		this.body = Bodies.circle(x, y, r, options);
		Body.setMass(this.body, this.body.mass*4);
		World.add(world, this.body);
		//console.log(this.body);
		this.r = r;
		this.isBoosting = false;
		this.isRotating = 0;
		
	}

	show() {
		const pos = this.body.position;
		const angle = this.body.angle;
		
		
		push();
		translate(pos.x, pos.y);
		rotate(angle);
		rectMode(CENTER);
		noFill();
		stroke(0, 255, 0);
		//imageMode(CENTER);
		circle(0, 0, this.r * 2, this.r * 2);
		line(0, 0, this.r, 0);	//show angle
		if (this.isBoosting) {
			boost();
		}
		
		if (this.isRotating != 0) {
			this.setRotation(this.isRotating);
		}
		pop();

	}
	
	boosting(b) {
		this.isBoosting = b;
	}
	
	boost() {
		var fVector = p5.Vector.fromAngle(this.body.angle);
		fVector.mult(.2);
		//console.log(fVector.x, fVector.y, this.body.angle);
		Body.applyForce(this.body, this.body.position,  fVector);
	}
	
	setRotation(a) {
		this.isRotating = a;
		Body.rotate(this.body, this.isRotating);
	}
  
  	hits(asteroid) {

		//use p5.lerp function to increment green to red transition

		var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
		var range = this.forceField ? this.r +  50 : this.r;

		if (d < range + asteroid.r) {

			//asteroid.changeDir();
			this.health -= deltaHealth;
			//this.changeColor();
			return true;
		} else {
			return false;
		}			

	}
	
	edges() {
		var nx = 0; 
		var ny = 0;
		
		if (this.body.position.x > width + this.r) {
			nx = -this.r;
		} else if (this.body.position.x < -this.r) {
			nx = width + this.r;
		}
		if (nx != 0) {
			Body.setPosition(this.body, { x: nx, y: this.body.position.y });
		}
		
		if (this.body.position.y > height + this.r) {
			ny = -this.r;
		} else if (this.body.position.y < -this.r) {
			ny = height + this.r;
		}
		
		if (ny != 0) {
			Body.setPosition(this.body, { x: this.body.position.x, y: ny });
		}

	}
}