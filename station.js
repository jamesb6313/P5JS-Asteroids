class Station {
  
	constructor(x, y, w, h) {
		this.deltaHealth = 0.01;
		this.health = 1.0;
		this.clr = 255;
		
		const options = {
		  restitution: 0.5,
		  isStatic: true,
		  label: "station"
		}    
		this.body = Matter.Bodies.rectangle(x, y, w, h, options);
		Body.setMass(this.body, this.body.mass*4);

		let group = Body.nextGroup(false);			 //to get a non-colliding group, then set 
		this.body.collisionFilter.group = group;

		//console.log(group);
		//console.log("station - Body Collision Filter = ", this.body.collisionFilter);


		Matter.World.add(world, this.body);
		this.id = this.body.id;
		this.w = w;
		this.h = h;
	}
  
	show() {
		const pos = this.body.position;
		const angle = this.body.angle;
		
		push();
		translate(pos.x, pos.y);
		rotate(angle);
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
		stations.splice(idx, 1);
		this.clr = 255;
	}
}