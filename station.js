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
		let posX = stations[idx].x;
		let posY = stations[idx].y;
		
		
		for (let i = 0; i < 5; i++) {
			//let r = random(1, 4);
			
			fireworks.push(new Firework(posX + (i * 5), posY + (i * 5)));			
		}
		
		//remove p5 station from array - body removed in addEvents collisionEnd
		stations.splice(idx, 1);
		
		this.clr = 255;
	}
}