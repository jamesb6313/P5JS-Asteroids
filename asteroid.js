function Asteroid(pos, r) {
	
	if (pos) {
		this.pos = pos.copy();
	} else {
				
		this.pos = createVector(random(width), random(height));
	}
	if (r) {
		this.r = r * 0.5;
	} else {
		this.r = random(15, 50);
	}
	

	this.total = random(5, 15);
	this.vel = p5.Vector.random2D();

	this.offset = [];		
	for (var i = 0; i < this.total; i++) {
		this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
	}

	//
	
	let vertx = []
	for (var i = 0; i < this.total; i++) {
		var angle = map(i, 0, this.total, 0, TWO_PI);
		var x = (this.r + this.offset[i])*cos(angle);
		var y = (this.r + this.offset[i])*sin(angle);
		vertx[i] = vertex(x,y)
	}
	
	const options = {
      restitution: 0.5
    }
    this.body = Matter.Bodies.fromVertices(this.pos.x, this.pos.y, vertx);
    Matter.Body.setMass(this.body, this.body.mass*4);
    Matter.World.add(world, this.body);
	
	//	
		
	this.breakup = function() {
		//can cause same problem as on startup is asteroid is drawn on ship
		var newA = [];
		newA[0] = new Asteroid(this.pos, this.r);
		newA[1] = new Asteroid(this.pos, this.r);
		return newA;
	}
	
	this.changeDir = function() {
		this.vel.mult(-1);
		//console.log(this.vel);
		this.update();
	}
	
	this.update = function() {
		this.pos.add(this.vel);
		//this.vel.mult(0.99);	//dampen ever frame
	}
	
	this.render = function() {
		const pos = this.body.position;
		const bAngle = this.body.angle;
		push();
		translate(this.pos.x, this.pos.y);
		
		noFill();
		stroke(225);		
		beginShape();
		for (var i = 0; i < this.total; i++) {
			var angle = map(i, 0, this.total, 0, TWO_PI);
			var x = (this.r + this.offset[i])*cos(angle);
			var y = (this.r + this.offset[i])*sin(angle);
			vertex(x,y)
		}
		endShape(CLOSE);
		pop();
	}
	
		
	this.edges = function() {
		if (this.pos.x > width + this.r) {
			this.pos.x = -this.r;
		} else if (this.pos.x < -this.r) {
			this.pos.x = width + this.r;
		}
		
		if (this.pos.y > height + this.r) {
			this.pos.y = -this.r;
		} else if (this.pos.y < -this.r) {
			this.pos.y = height + this.r;
		}
	}
}