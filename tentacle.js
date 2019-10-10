// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Video: https://youtu.be/10st01Z0jxc
// Tanscription to Javascript: Chuck England

class Tentacle {
    constructor(x, y, numSegments) {
        this.segments = [];
		this.deltaX = 5;		//move 5 pixels right
		this.deltaY = 5;		//move 5 pixels down
		
		this.deltaHealth = 0.05;
		this.health = 1.0;
		this.clr = color(0, 255, 0, 100);
		
        this.base = createVector(x, y);
        this.len = segLength;
        this.segments[0] = new Segment(x, y, this.len, 0, numSegments);
        for (let i = 1; i < numSegments; i++) {
            this.segments[i] = new Segment(this.segments[i - 1], this.len, i, numSegments);
        }
		
		const options = {
			isSensor: true,
			label: "tentacleSensor"
		}
		let sensorPos = this.segments[this.segments.length - 1].b;
		this.body = Bodies.circle(sensorPos.x, sensorPos.y, 1, options);
		this.id = this.body.id;
		World.add(world, this.body);
    }
	
	sensorPos() {
		return this.segments[this.segments.length - 1].b;
	}
	
	changeColor() {
		var gr = color(0, 255, 0, 100);
		var rd = color(255, 0, 0, 100);
		this.clr = lerpColor(gr, rd, 1 - this.health);
	}
	
	moveClockwise() {
		// Clockwise movement around screen
		
		if (this.base.x < width && this.base.y == height) {	//move to right along bottom
		//console.log('bottom', this.base);
			this.base.x += this.deltaX;
			if (this.base.x > width) {
				this.base.x = width;
			}
			return;
		}
		if (this.base.x > 0 && this.base.y == 0) {			//move to left along top
		//console.log('top', this.base);
			this.base.x -= this.deltaX;
			if (this.base.x < 0) {
				this.base.x = 0;
			}
			return;
		}
		
		if (this.base.y > 0 && this.base.x == width) {		//move up along left edge
		//console.log('left', this.base);
			this.base.y -= this.deltaY;
			if (this.base.y < 0) {
				this.base.y = 0;
			}
			return;
		}
		if (this.base.y < height && this.base.x == 0) {		//move down along right edge
		//console.log('right = ', this.base);
			this.base.y += this.deltaY;
			return;
		}
		
	}

    update(baseX,baseY,followX,followY) {
		this.base = createVector(baseX, baseY);
	//update(followX,followY) {
        let total = this.segments.length;
        let end = this.segments[total - 1];
		
		this.body.position = end.b;
		
		end.follow(followX,followY);
		end.update(baseX,baseY,followX,followY);
		//end.update(followX,followY);

        for (let i = total - 2; i >= 0; i--) {
            this.segments[i].followChild(this.segments[i + 1]);
			this.segments[i].update(baseX,baseY,followX,followY);
            //this.segments[i].update(followX,followY);
        }

        this.segments[0].setA(this.base);

        for (let i = 1; i < total; i++) {
            this.segments[i].setA(this.segments[i - 1].b);
        }
		
    }

    show() {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].show(this.clr);
        }
    }
	
	//tentacleSensor collision
	collisions(scaleFactor) {
		this.health -= this.deltaHealth * scaleFactor;
		this.health = 
			(this.health < 0) ? 0 : this.health;
			
		this.changeColor();		
	}
}