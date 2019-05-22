let colm;
let rows;
let w;
let grid;

let curr;
let goal;

let stack;

const GameState = {
    PREPARING: 1,
    PLAYING: 2,
    GAME_OVER: 3
};

let state;
let dir;

let mazeStart;

function resetGame() {
    colm = +document.querySelector("input").value;
    rows = colm;

    grid = [];
    stack = [];

    state = GameState.PREPARING;
    dir = 0;
    document.getElementById("score").innerText = 0;

    mazeStart = 0;

    w = width / colm;
	for (var j = 0; j < rows; j++) {
		for (var i = 0; i < colm; i++) {
			var box = new Box(i, j);
			grid.push(box);
		}
	}
	curr = grid[0];
	goal = grid[grid.length - 1];
}

function setup() {
    createCanvas(600, 600);
    resetGame();
}

function draw() {
	background(255, 121, 63); //Aelo orange
	for (var i = 0; i < grid.length; i++) {
		grid[i].show();
	}

	// Change colour of goal box
	var goalX = goal.i * w;
	var goalY = goal.j * w;
	noStroke();
	fill(51);
	rect(goalX, goalY, w, w);

	// Change colour of curr box
	var currX = curr.i * w;
	var currY = curr.j * w;
	noStroke();
	fill(51); //#333333
	rect(currX, currY, w, w);

	curr.visited = true;
	var next = curr.checkNeighbours();

	if (next) {
		stack.push(curr);
		removeWalls(curr, next);
		curr = next;
	} else if (stack.length > 0) {
		curr = stack.pop();
	} else if (state == GameState.PREPARING) {
        state = GameState.PLAYING;
	}

	if (state == GameState.PLAYING) {
        const ms = millis();
        if (!mazeStart) mazeStart = ms;
        const timeElapsed = floor((ms - mazeStart) / 1000);
        
        document.querySelector("#score").innerText = timeElapsed;

        switch (dir) {
        case 1:
            //Top
			next = grid[index(curr.i, curr.j - 1)];
            break;
        case 2:
            //Right
			next = grid[index(curr.i + 1, curr.j)];
            break;
        case 3:
            //Bottom
			next = grid[index(curr.i, curr.j + 1)];
            break;
        case 4:
            //Left
			next = grid[index(curr.i - 1, curr.j)];
            break;
        }

        if (dir != 0 && next && !curr.walls[dir - 1]) {
            curr = next;
        }

        dir = 0;

        if (goal.isInSamePositionAs(curr)) {
            state = GameState.GAME_OVER;
            console.log("Game over");
            // alert("You have won the game, your final score was: " + timeElapsed);
        }
    }

    if (state == GameState.GAME_OVER) {
        
    }
}

// Play functionality
function keyPressed() {
	if (keyCode === UP_ARROW) {
        dir = 1;
	} else if (keyCode === RIGHT_ARROW) {
        dir = 2;
	} else if (keyCode === DOWN_ARROW) {
        dir = 3;
	} else if (keyCode === LEFT_ARROW) {
		dir = 4;
    }
}

function index(i, j) {
	if (i < 0 || j < 0 || i > colm - 1 || j > rows - 1) {
		return -1;
	}

	return i + j * colm;
}

function removeWalls(a, b) {
	var x = a.i - b.i;
	if (x === 1) {
		a.walls[3] = false;
		b.walls[1] = false;
	} else if (x === -1) {
		a.walls[1] = false;
		b.walls[3] = false;
	}
	var y = a.j - b.j;
	if (y === 1) {
		a.walls[0] = false;
		b.walls[2] = false;
	} else if (y === -1) {
		a.walls[2] = false;
		b.walls[0] = false;
	}
}
