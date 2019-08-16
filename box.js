class Box {
  
  constructor(x, y, w, h) {
    const options = {
      restitution: 0.5,
	  isStatic: true,
	  label: "box"
    }    
    this.body = Matter.Bodies.rectangle(x, y, w, h, options);
	Body.setMass(this.body, this.body.mass*4);
	
	let group = Body.nextGroup(false);			 //to get a non-colliding group, then set 
	this.body.collisionFilter.group = group;
	
	console.log(group);
	console.log("box - Body Collision Filter = ", this.body.collisionFilter);
	
	
    Matter.World.add(world, this.body);
    this.w = w;
    this.h = h;
  }
  
  show() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    fill(255);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    pop(); 
  }
  
}