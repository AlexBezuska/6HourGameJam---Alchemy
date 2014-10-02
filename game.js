"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
		"bg": "img/bg.png"
	},
	"sounds": {},
	"fonts": {},
	"animations": {
		"ice-idle": {
			"strip": "img/ice.png",
			"frames": 2,
			"msPerFrame": 200
		},
		"water-idle": {
			"strip": "img/water.png",
			"frames": 2,
			"msPerFrame": 200
		},
		"steam-idle": {
			"strip": "img/steam.png",
			"frames": 2,
			"msPerFrame": 200
		},
		"fire-idle": {
			"strip": "img/fire.png",
			"frames": 2,
			"msPerFrame": 200
		},
		"cold-ball-idle": {
			"strip": "img/cold-ball.png",
			"frames": 2,
			"msPerFrame": 200
		}
	}
};


var bounds = {
	top: 0,
	left: 0,
	right: canvas.width,
	bottom: canvas.height
};


var playerYSpeed = 3.2;
var playerXSpeed = 3.2;
var playerMoving = false;
var player2YSpeed = 3.2;
var player2XSpeed = 3.2;
var player2Moving = false;
var cold = false;
var game = new Splat.Game(canvas, manifest);

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
	var y = offsetY | 0;
	context.fillText(text, x, y);
}

// function isInside(container, item) {
// 	return item.x >= container.x &&
// 		item.x + item.width <= container.x + container.width &&
// 		item.y >= container.y &&
// 		item.y + item.height <= container.y + container.height;
// }

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization
	this.timers.expire = new Splat.Timer(undefined, 5, function() {
		game.scenes.switchTo("game");
	});
	this.timers.expire.start();
}, function() {
	// simulation
}, function(context) {
	// draw
	context.fillStyle = "#092227";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#fff";
	context.font = "25px helvetica";
	centerText(context, "#6HourGameJam", 0, canvas.height / 2 - 13);
}));


game.scenes.add("game", new Splat.Scene(canvas, function() {
		// initialization

		//player 1
		this.playerIdle = game.animations.get("ice-idle");
		this.player = new Splat.AnimatedEntity((bounds.right / 2) - (this.playerIdle.width / 2), 25, this.playerIdle.width, this.playerIdle.height, this.playerIdle, 0, 0);
		this.player.state = "ice";

		//player 2

		this.player2IdleHot = game.animations.get("fire-idle");
		this.player2IdleCold = game.animations.get("cold-ball-idle");
		this.player2 = new Splat.AnimatedEntity((bounds.right / 2) - (this.player2IdleHot.width / 2), 25, this.player2IdleHot.width, this.player2IdleHot.height, this.player2IdleHot, 0, 0);



	}, function() {
		// simulation
		//var moveSpeed = 0.6;

		game.animations.get("ice-idle").move();
		if (game.keyboard.isPressed("left")) {
			this.player.vx = -playerXSpeed;
			this.player.vy = 0;
			playerMoving = true;
		} else if (game.keyboard.isPressed("right")) {
			this.player.vx = playerXSpeed;
			this.player.vy = 0;
			playerMoving = true;
		} else if (game.keyboard.isPressed("up")) {
			this.player.vy = -playerYSpeed;
			this.player.vx = 0;
			playerMoving = true;
		} else if (game.keyboard.isPressed("down")) {
			this.player.vy = playerYSpeed;
			this.player.vx = 0;
			playerMoving = true;
		} else {
			playerMoving = false;
		}

		if (playerMoving) {
			this.player.x += this.player.vx;
			this.player.y += this.player.vy;
		}


		if (this.player.state === "steam") {
			this.player.sprite = game.animations.get("steam-idle");
		} else if (this.player.state === "water") {
			this.player.sprite = game.animations.get("water-idle");
		} else {
			this.player.sprite = game.animations.get("ice-idle");
		}

		// change states
		if (game.keyboard.consumePressed("space")) {
			if (cold) {
				cold = false;
			} else {
				cold = true;
			}
		}

		//affect player
		if (this.player.collides(this.player2)) {

			if (this.player.changeable) {
				if (cold) {
					if (this.player.state === "steam") {
						this.player.state = "water";
					} else if (this.player.state === "water") {
						this.player.state = "ice";
					}
				} else {
					if (this.player.state === "ice") {
						this.player.state = "water";
					} else if (this.player.state === "water") {
						this.player.state = "steam";
					}
				}
			}
			this.player.changeable = false;
		} else {
			this.player.changeable = true;
		}

		if (cold) {
			this.player2.sprite = game.animations.get("cold-ball-idle");
		} else {
			this.player2.sprite = game.animations.get("fire-idle");
		}

		game.animations.get("fire-idle").move();
		game.animations.get("cold-ball-idle").move();
		if (game.keyboard.isPressed("a")) {
			this.player2.vx = -player2XSpeed;
			this.player2.vy = 0;
			player2Moving = true;
		} else if (game.keyboard.isPressed("d")) {
			this.player2.vx = player2XSpeed;
			this.player2.vy = 0;
			player2Moving = true;
		} else if (game.keyboard.isPressed("w")) {
			this.player2.vy = -player2YSpeed;
			this.player2.vx = 0;
			player2Moving = true;
		} else if (game.keyboard.isPressed("s")) {
			this.player2.vy = player2YSpeed;
			this.player2.vx = 0;
			player2Moving = true;
		} else {
			player2Moving = false;
		}



		if (player2Moving) {
			this.player2.x += this.player2.vx;
			this.player2.y += this.player2.vy;
		}


		/* Bounds checking  player 1*/
		if (this.player.x < bounds.left) {
			this.player.x = bounds.left;
		}
		if (this.player.x + this.player.width > bounds.right) {
			this.player.x = bounds.right - this.player.width;
		}
		if (this.player.y < bounds.top) {
			this.player.y = bounds.top;
		}
		if (this.player.y + this.player.height > bounds.bottom) {
			this.player.y = bounds.bottom - this.player.height;
		}


	},
	function(context) {
		// draw
		context.fillStyle = "#b7c370";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.drawImage(game.images.get("bg"), 0, 0);

		this.player.draw(context);
		this.player2.draw(context);

	}));

game.scenes.switchTo("loading");