class Ship {

	constructor(pos, r, angle) {
		this.r = r;
		this.pos = pos;
		this.vertx = [];
		this.deltaHealth = 0.01;
		this.health = 1.0;
		this.fieldColor = color(0, 255, 0);	
		this.forceField = true;		
		this.isBoosting = false;
		this.isRotating = 0;

		const options = {
			friction: 0.0,
			frictionAir : 0.01,
			restitution: 0.3,
			angle: angle,
			label: "ship"
		}

		//Need vertices to be in clockwise order (see: Matter.js Bodies.fromVertices())
		//relative to {0,0}
		var x1 = (shipRadius)*cos(0);
		var y1 = (shipRadius)*sin(0);		
		this.vertx[0] = { x: x1, y: y1 };	//vertex(x,y)
		x1 = (shipRadius)*cos(4*PI/3);
		y1 = (shipRadius)*sin(4*PI/3);		
		this.vertx[1] = { x: x1, y: y1 };	//vertex(x,y)
		x1 = (shipRadius)*cos(2*PI/3);
		y1 = (shipRadius)*sin(2*PI/3);		
		this.vertx[2] = { x: x1, y: y1 };	//vertex(x,y)
		
		this.body = Bodies.fromVertices(this.pos.x, this.pos.y, this.vertx, options);		
		//this.body = Bodies.circle(x, y, r, options);
		Body.setMass(this.body, this.body.mass*4);
		World.add(world, this.body);
		
		let group = Body.nextGroup(false);
		this.body.collisionFilter.group = group;
		
		//console.log(this.body);
		//console.log("ship - Body Collision Filter = ", this.body.collisionFilter);		
	}
	
	changeColor() {
		var gr = color(0, 255, 0);
		var rd = color(255, 0, 0);
		this.fieldColor = lerpColor(gr, rd, 1 - this.health);
	}

	show() {
		const pos = this.body.position;
		const angle = this.body.angle;
		
		
		push();
		translate(pos.x, pos.y);
		rotate(angle);
		rectMode(CENTER);
		noFill();
		strokeWeight(1);
		stroke(this.fieldColor);
		//circle(0, 0, this.r * 2, this.r * 2);
		line(0, 0, this.r, 0);	//show angle
		//
		line(this.vertx[0].x, this.vertx[0].y, this.vertx[1].x, this.vertx[1].y);
		line(this.vertx[1].x, this.vertx[1].y, this.vertx[2].x, this.vertx[2].y);
		line(this.vertx[2].x, this.vertx[2].y, this.vertx[0].x, this.vertx[0].y);
		//
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
		fVector.mult(.03);
		//console.log(fVector, this.body.angle);
		//console.log({ x: fVector.x, y : fVector.y }, this.body.angle);
		Body.applyForce(this.body, this.body.position,  { x: fVector.x, y : fVector.y } );
	}
	
	setRotation(a) {
		this.isRotating = a;
		Body.rotate(this.body, this.isRotating);
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
	
	collisions(hitMass) {
		this.health -= this.deltaHealth * hitMass;
		this.health = 
			(this.health <= 0) ? 0 : this.health;
			
		this.changeColor();
		
	}
}