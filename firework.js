function Firework(x,y) {
	this.x = x;
	this.y = y;
	this.hu = random(255);
	this.firework = new Particle(this.x, this.y, true, this.hu);
	this.exploded = false;
	this.particles = [];
	
	this.done = function() {
		if (this.exploded && this.particles.length ===0) {
			return true;
		} else {
			return false;
		}
	}
	
	this.update = function() {
		
		if (!this.exploded) {
			//this.firework.applyForce(gravity);
			this.firework.update();
			
			//if (this.firework.vel.y >= 0) {
				this.exploded = true;
				this.explode();
			//}
		}
		
		for (var i = this.particles.length - 1; i >= 0 ; i--) {
			//this.particles[i].applyForce(gravity);
			this.particles[i].update();
			if (this.particles[i].done()) {
				this.particles.splice(i , 1);
			}
		}
		
	}
	
	this.explode = function() {
		for (var i = 0; i < 100; i++) {
			var p = new Particle(this.firework.pos.x,this.firework.pos.y, false, this.hu);
			
/* 			var x = floor(100+ i);
			var y = floor(this.firework.pos.y);
			console.log(x,y);
			p.vel = createVector(x, y);
			p.vel.mult(random(-0.05,0.05)); */
			
			this.particles.push(p);
		}
	}
	
	this.show = function() {
		if (!this.exploded) {
			this.firework.show();
		}
		for (var i = this.particles.length - 1; i >= 0 ; i--) {
			this.particles[i].show();
		}
	}
}