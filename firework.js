function Firework(x,y,numParticles) {
	this.x = x;
	this.y = y;
	this.firework = new Particle(this.x, this.y, true);
	this.exploded = false;
	this.particles = [];
	this.numParticles = numParticles;
	
	this.done = function() {
		if (this.exploded && this.particles.length ===0) {
			return true;
		} else {
			return false;
		}
	}
	
	this.update = function() {
		
		if (!this.exploded) {
			this.firework.update();
			
			//if (this.firework.vel.y >= 0) {
				this.exploded = true;
				this.explode();
			//}
		}
		
		for (var i = this.particles.length - 1; i >= 0 ; i--) {
			this.particles[i].update();
			if (this.particles[i].done()) {
				this.particles.splice(i , 1);
			}
		}
		
	}
	
	this.explode = function() {
		for (var i = 0; i < this.numParticles; i++) {
			var p = new Particle(this.firework.pos.x,this.firework.pos.y, false);
			
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