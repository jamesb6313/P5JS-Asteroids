// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Video: https://youtu.be/10st01Z0jxc
// Tanscription to Javascript: Chuck England

class Segment {
    constructor(x, y, len, idx, numSegments) {
        this.angle = 0;
		
        this.b = createVector();
        if (x instanceof Segment) {	// called with: new Segment(this.segments[i - 1], this.len, i, numSegments);
            // create from vector x, with len y			
            this.sw = map(len, 0, idx, 10, 1);
            this.a = x.b.copy();
            this.len = y;
            this.calculateB();
        } else {
            // create new vector
            this.a = createVector(x, y);
            this.sw = map(idx, 0, numSegments, 10, 1);
            this.len = len;
            this.calculateB();
        }
    }

    followChild(child) {
        let targetX = child.a.x;
        let targetY = child.a.y;
        this.follow(targetX, targetY);
    }

    follow(tx, ty) {
        let target = createVector(tx, ty);
        let dir = p5.Vector.sub(target, this.a);
        this.angle = dir.heading();
        dir.setMag(this.len);
        dir.mult(-1);
        this.a = p5.Vector.add(target, dir);
    }

    setA(pos) {
        this.a = pos.copy();
        this.calculateB();
    }

    calculateB() {
        let dx = this.len * cos(this.angle);
        let dy = this.len * sin(this.angle);
        this.b.set(this.a.x + dx, this.a.y + dy);
    }

    update() {
        this.calculateB();
    }

    show(clr) {
        stroke(clr);
        strokeWeight(this.sw);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}
