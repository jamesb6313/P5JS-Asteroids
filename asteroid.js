class Asteroid {
	
	constructor(pos, r, oldR) {
		var bodyLabel = 'asteroid';
		
		if (pos) {
			this.pos = pos;		
		} else {				
			this.pos = createVector(random(width), random(height));
		}
		if (r) {
			this.r = r * 0.5;
		} else {
			this.r = random(15, 50);
		}
		if (oldR) {
			bodyLabel = 'asteroidDebris';
			this.parentR = oldR;
		}
		
		this.dead = false;
		this.split = false
		
		
		//this.total = random(5, 15);
		this.vel = p5.Vector.random2D();
		this.vel.mult(2);

/* 		this.offset = [];		
		for (var i = 0; i < this.total; i++) {
			this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
		}
			
		let vertx = []
		for (var i = 0; i < this.total; i++) {
			var tangle = map(i, 0, this.total, 0, TWO_PI);
			var x = (this.r + this.offset[i])*cos(tangle);
			var y = (this.r + this.offset[i])*sin(tangle);
			vertx[i] = vertex(x,y)
		} */
		
		const options = {
		    restitution: 0,
		  	friction: 0.0,
			frictionAir : 0.0,
			frictionStatic: 0.0,
			//angle:2,
		    label: bodyLabel
		}
		//this.body = Bodies.fromVertices(this.pos.x, this.pos.y, vertx, options);
		this.body = Bodies.circle(this.pos.x, this.pos.y, this.r, options);
		Body.setMass(this.body, this.body.mass*4);
		Body.setVelocity(this.body, {x: this.vel.x, y: this.vel.y} );
		World.add(world, this.body);
		
		this.id = this.body.id;
		
	}
	
	show() {
		const pos = this.body.position;
		const bAngle = this.body.angle;
		
		push();
		translate(pos.x, pos.y);
		rotate(bAngle);
		noFill();
		stroke(225);
		circle(0, 0, this.body.circleRadius * 2, this.body.circleRadius * 2);
		line(0, 0, this.body.circleRadius, 0);	//show angle		
 		/* beginShape();
		for (var i = 0; i < this.total; i++) {
			var angle = map(i, 0, this.total, 0, TWO_PI);
			var x = (this.r + this.offset[i])*cos(angle);
			var y = (this.r + this.offset[i])*sin(angle);
			vertex(x,y)
		}
		endShape(CLOSE); */
		pop();
	}
		
	breakup() {
		
		var pos = this.pos.copy();
		var cr = 1;
		var oldR = this.r;
		
		//can cause same problem as on startup is asteroid is drawn on ship
		var newA = [];
		
		pos.x = pos.x + oldR * cos(PI);
		pos.y = pos.y + oldR * sin(PI);
		console.log('newA0 : ', pos);
		newA[0] = new Asteroid(pos, cr, oldR );
		
		pos.x = pos.x + oldR * cos(0);
		pos.y = pos.y + oldR * sin(0);
		console.log('newA1 : ', pos);
		newA[1] = new Asteroid(pos, cr, oldR );
		return newA;
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