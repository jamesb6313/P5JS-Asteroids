function Ship() {
	this.pos = createVector(width/2, height/2);
	this.r = 20;
	this.heading = 0;
	this.rotation = 0;
	this.vel = createVector(0,0);
	this.isBoosting = false;
	this.red = 0;
	this.grn = 255;
	
	this.render = function() {
		push();
		translate(this.pos.x, this.pos.y);
		rotate(this.heading + (PI /2));
		fill(0);
		stroke(this.red, this.grn, 0);
		triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
		pop();
	}
	
	this.hits = function(asteroid) {
		var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
		if (d < this.r + asteroid.r) {
			this.changeColor();
			asteroid.changeDir();

			return true;
		} else {
			return false;
		}
	}
	
	this.changeColor = function() {
		
		if (this.grn > 0) {
			this.grn = 0;
			this.red = 255;
		} else {
			this.grn = 255;
			this.red = 0;
		}
		console.log(this.red, this.grn);
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
	
	this.boosting = function(b) {
		this.isBoosting = b;
	}
	
	this.update = function() {
		if (this.isBoosting) {
			this.boost();
		}
		this.pos.add(this.vel);
		this.vel.mult(0.99);	//dampen ever frame
	}
	
	this.boost = function() {
		var force = p5.Vector.fromAngle(this.heading);
		force.mult(0.1);
		this.vel.add(force);
	}
	
	this.setRotation = function(a) {
		this.rotation = a;
	}
	
	this.turn = function() {
		this.heading += this.rotation;;
	}
}