class Box {
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.walls = [true, true, true, true]; // top, right, bottom, left
		this.visited = false;

		this.checkNeighbours = function() {
			var neighbours = [];

			var top = grid[index(this.i, this.j - 1)];
			var right = grid[index(this.i + 1, this.j)];
			var bottom = grid[index(this.i, this.j + 1)];
			var left = grid[index(this.i - 1, this.j)];

			if (top && !top.visited) {
				neighbours.push(top);
			}

			if (right && !right.visited) {
				neighbours.push(right);
			}

			if (bottom && !bottom.visited) {
				neighbours.push(bottom);
			}

			if (left && !left.visited) {
				neighbours.push(left);
			}

			if (neighbours.length > 0) {
				var r = floor(random(0, neighbours.length));
				return neighbours[r];
			} else {
				return undefined;
			}
		};

		this.show = function() {
			var x = this.i * w;
			var y = this.j * w;

			if (this.visited) {
				noStroke();
				fill(29, 167, 234);
				rect(x, y, w, w);
			}

			stroke(255);
			strokeWeight(2);

			if (this.walls[0]) {
				line(x, y, x + w, y); // top
			}

			if (this.walls[1]) {
				line(x + w, y, x + w, y + w); // right
			}

			if (this.walls[2]) {
				line(x, y + w, x + w, y + w); // bottom
			}

			if (this.walls[3]) {
				line(x, y, x, y + w); // left
			}
		};
	}

	isInSamePositionAs(other) {
		return other.i == this.i && other.j == this.j;
	}
}
