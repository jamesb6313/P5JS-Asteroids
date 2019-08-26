function Particle(x,y,firework,hu) {
	this.pos = createVector(x,y);
	this.firework = firework;
	this.lifespan = random(20, 500);
	this.hu = hu;
	
	if (this.firework) {
		this.vel = createVector(0 ,random(-11,-7));
	} else {
		this.vel = p5.Vector.random2D();
		this.vel.mult(random(2, 8));
	}
	this.acc = createVector(0,0);
	//this.maxspeed = 2;
	
	this.prevPos = this.pos.copy();
	
	this.update = function() {
		if (!this.firework) {
			this.vel.mult(0.9);
			this.lifespan -= 4;
		}
		this.vel.add(this.acc);
		//this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.applyForce = function(force) {
		this.acc.add(force);
	}
	
	this.done = function() {
		if (this.lifespan < 0) {
			//console.log('true - ' + this.lifespan);
			return true;
		} else {
			//console.log('false - ' + this.lifespan);
			return false;
		}
		
	}
	
	this.show = function() {
		//colorMode(HSB);
		if (!this.firework) {
			strokeWeight(2);
			stroke(hu,255,255, this.lifespan);
		} else {
			stroke(hu,255,255);
			strokeWeight(4);
		}
		//to make bigger use ellipse()
		let r = random(1, 4);
		ellipse(this.pos.x, this.pos.y, r);
		line(this.pos.x, this.pos.y,this.prevPos.x, this.prevPos.y);
	}
	
}