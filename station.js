class Station {
  
	constructor(x, y, w, h) {
		this.deltaHealth = 0.01;
		this.health = 1.0;
		this.clr = 255;
		
		const options = {
		  restitution: 0.5,
		  //density: 0.1,	no effect	//default is 0.001, mass gets calculated
		  isStatic: true,  //can't dampen movement, body & p5 pos not equal, needs edges()
		  //isSensor: true,
		  label: "station"
		}    
		this.body = Matter.Bodies.rectangle(x, y, w, h, options);
		Body.setMass(this.body, this.body.mass*4);
		//Body.setDensity(this.body, 100);

		let group = Body.nextGroup(false);			 //to get a non-colliding group, then set 
		this.body.collisionFilter.group = group;

		//console.log(group);
		//console.log("station - Body Collision Filter = ", this.body.collisionFilter);


		Matter.World.add(world, this.body);
		this.id = this.body.id;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
  
	show() {
		const pos = this.body.position;
		const angle = this.body.angle;
		
		push();
		translate(pos.x, pos.y);
		rotate(angle);
		noStroke()
		fill(this.clr);
		rectMode(CENTER);
		rect(0, 0, this.w, this.h);
		pop(); 
	}
  
	changeColor() {
		var gr = color(255, 255, 255);
		var rd = color(255, 0, 0);
		this.clr = lerpColor(gr, rd, 1 - this.health);
	}
	
	explode(idx) {
		
		//console.log(this.x, this.y);
		
		//for (let i = 0; i < 15; i++) {
		let offsetX = random(this.x - this.w/2, this.x + this.w/2);
		let offsetY = random(this.y - this.h/2, this.y + this.h/2);
			
		//let numP = floor(random(400, 800));
		fireworks.push(new Firework(offsetX, offsetY, 200));			
		
		//remove p5 station from array - body removed in addEvents collisionEnd
		stations.splice(idx, 1);
		
		this.clr = 255;
	}
	
	collisions(hitMass) {
		this.health -= this.deltaHealth * hitMass;
		this.health = 
			(this.health < 0) ? 0 : this.health;
			
		this.changeColor();		
	}
}