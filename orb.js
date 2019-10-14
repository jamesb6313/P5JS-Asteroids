const radius = 10;

class Orb {
	
	
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.r = radius;	//need this for laser see laser.js line 44
		this.orbTentacle = new Tentacle(this.x, this.y, floor(random(5,10)), true );
		this.dead = false;
		this.maxHits = 5;
		this.vel = p5.Vector.random2D();
		this.vel.mult(2);
		
		const options = {
		    restitution: 0,
		  	friction: 0.0,
			frictionAir : 0.0,
			frictionStatic: 0.0,
			//angle:2,
		    label: 'orb'
		}
		
		this.body = Bodies.circle(this.x, this.y, radius, options);
		Body.setVelocity(this.body, {x: this.vel.x, y: this.vel.y} );
		World.add(world, this.body);
		
		this.id = this.body.id;		
	}
	
	show() {
		const pos = this.body.position;
		const angle = this.body.angle;
		this.x = pos.x;
		this.y = pos.y;
		
		push();
		translate(this.x, this.y);
		rotate(angle);
		noFill();
		strokeWeight(1);
		stroke(225);
		circle(0, 0, radius * 2, radius * 2);
		line(0, 0, radius, 0);	//show angle		
		pop();
	}
	
/* 	
target ship with laser fire - not working, but don't need
	follow(tx, ty) {
        let target = createVector(tx, ty);
        let dir = p5.Vector.sub(target, this.body.position);
        this.angle = dir.heading();
		Body.rotate(this.body, this.angle);
        //dir.setMag(this.len);
        //dir.mult(-1);
        //this.a = p5.Vector.add(target, dir);
    } */
			
	edges() {
		const pos = this.body.position;
		
		var nx = 0; 
		var ny = 0;
		if (pos.x > width + radius) {
			nx = -radius;
		} else if (pos.x < -radius) {
			nx = width + radius;
		}
		if (nx != 0) {
			Body.setPosition(this.body, { x: nx, y: pos.y });
			this.x = nx;
			this.y = pos.y;
		}
		
		if (pos.y > height + radius) {
			ny = -radius;
		} else if (pos.y < -radius) {
			ny = height + radius;
		}
		
		if (ny != 0) {
			Body.setPosition(this.body, { x: pos.x, y: ny });
			this.x = pos.x;
			this.y = ny;
		}
	}
}