let colm;
let rows;
let w;
let grid;

let curr;
let goal;

let stack;

var latestScore;
var highscorers = [];

const GameState = {
	PREPARING: 1,
	PLAYING: 2,
	GAME_OVER: 3
};

let state;
let dir;

let mazeStart;

let score;

let timeElapsed;

var keys = {};
window.addEventListener(
	"keydown",
	function(e) {
		keys[e.keyCode] = true;
		switch (e.keyCode) {
			case 37:
			case 39:
			case 38:
			case 40: // Arrow keys
			case 32:
				e.preventDefault();
				break; // Space
			default:
				break; // do not block other keys
		}
	},
	false
);
window.addEventListener(
	"keyup",
	function(e) {
		keys[e.keyCode] = false;
	},
	false
);

function setup() {
	var canvas = createCanvas(600, 600);
	resetGame();
	canvas.parent("sketch-holder");

	// set options to prevent default behaviors for swipe, pinch, etc
	var options = {
		preventDefault: true
	};

	// document.body registers gestures anywhere on the page
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
		timeElapsed = floor((ms - mazeStart) / 1000);

		document.querySelector("#score").innerText = timeElapsed;
		// score = timeElapsed;
		// console.log(score);

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

		gameOverIfNeeded();
	}
}

function resetGame() {
	colm = +document.getElementById("colmInput").value;
	rows = colm;

	grid = [];
	stack = [];

	state = GameState.PREPARING;
	dir = 0;
	document.getElementById("score").innerText = 0;

	loadScores();
	updateLeaderboard();

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

	// localStorage.setItem("name", document.getElementById("name").value);
	// var name = localStorage.getItem("name");
	// console.log(name);
	// // console.log(document.getElementById("name").value)
	// document.getElementById("scorer1").innerHTML = localStorage.getItem(
	// 	"name"
	// );
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

function swiped(event) {
	console.log(event);

	if (event.direction == 4) {
		dir = 2;
		// console.log("hi");
	} else if (event.direction == 8) {
		dir = 1;
		// console.log("hi");
	} else if (event.direction == 16) {
		dir = 3;
		// console.log("hi");
	} else if (event.direction == 2) {
		dir = 4;
		// console.log("hi");
	}
}

var currX;
var currY;
var oldX;
var oldY;
var dx;
var dy;

function touchStarted() {
	oldX = mouseX;
	oldY = mouseY;
}

function touchEnded() {
	currX = mouseX;
	currY = mouseY;
	dx = currX - oldX;
	dy = currY - oldY;

	var swipeRight = dx > 0 && Math.abs(dx) > Math.abs(dy);
	var swipeLeft = dx < 0 && Math.abs(dx) > Math.abs(dy);
	var swipeUp = dy < 0 && Math.abs(dy) > Math.abs(dx);
	var swipeDown = dy > 0 && Math.abs(dy) > Math.abs(dx);

	var safeZone = Math.sqrt(
		Math.pow(currX - oldX, 2) + Math.pow(currY - oldY, 2)
	);

	if (swipeRight && safeZone > 50) {
		dir = 2;
		console.log(safeZone);
	}

	if (swipeLeft && safeZone > 50) {
		dir = 4;
		console.log(safeZone);
	}

	if (swipeUp && safeZone > 50) {
		dir = 1;
		console.log(safeZone);
	}

	if (swipeDown && safeZone > 50) {
		dir = 3;
		console.log(safeZone);
	}
}

let scores = {};

function loadScores() {
	scores = JSON.parse(localStorage.getItem("scores") || "{}");
}

function gameOverIfNeeded() {
	if (!goal.isInSamePositionAs(curr)) return;

	state = GameState.GAME_OVER;
	console.log("Game over");

	// alert("You have won the game, your final score was: " + timeElapsed);

	loadScores();

	var person = document.getElementById("name").value;
	if (person !== "" && (!scores[colm] || scores[colm].time > timeElapsed)) {
		scores[colm] = {
			name: person,
			time: timeElapsed
		};
	}

	console.log(scores);

	localStorage.setItem("scores", JSON.stringify(scores));

	updateLeaderboard();

	// console.log(fullHighScore);

	// localStorage.setItem("score", latestScore);
	// var storedScore = localStorage.getItem("score");
	// highscorers.push(storedScore);

	// highscorers.sort(function(a, b) {
	// 	return a - b;
	// });
	// // console.log(timeElapsed);
	// // highscorers.reverse();
	// console.log(highscorers);

	// var highString = highscorers.toString();
	// highString.split(",");

	// for (var i = 0; i < highscorers.length - 1; ++i) {
	// 	var id = "scorer" + i;
	// 	console.log(id);
	// 	var person = document.getElementById("name").value;
	// 	var combined = person + ": " + storedScore;
	// 	console.log(combined);
	// 	// document.getElementById(id).innerText =
	// }
}

function updateLeaderboard() {
	let ul = document.getElementById("liststuff");
	ul.innerHTML = "";

	let keys = Object.keys(scores)
		.map(k => +k)
		.sort();
	let strings = keys.map(col => {
		let item = scores[col];
		return `${col}: ${item.name} (${item.time}s)`;
	});

	strings.forEach(str => {
		var li = document.createElement("li");
		li.innerText = str;
		ul.appendChild(li);
	});

	// [...ul.childNodes].forEach(ul.removeChild)
	console.log(strings);
}
