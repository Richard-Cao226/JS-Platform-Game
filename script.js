var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')

var gravity = 0.3
var playerWidth = 30
var playerHeight = 30
var paused = false
var jumpingXSpeed = 1.8
var walkingXSpeed = 2

var player1X = 50
var player1Y = canvas.height - playerHeight
var speed1X = walkingXSpeed
var speed1Y = 0
var jumping1 = false
var jumpPower = 7
var wReleased = true
var swordRadius = 30
var sword1X = player1X-swordRadius/2
var sword1Y = player1Y
var sword1SpeedX = 0
var sword1SpeedY = 0
var holding1Player = 1
var player1HasSword = true
var throwPower = 7
var sword1Grounded = false
var swordRightSpr = new Image()
swordRightSpr.src = "sprites/pirate_sword_right.png"
var swordLeftSpr = new Image()
swordLeftSpr.src = "sprites/pirate_sword_left.png"
var sword1 = swordRightSpr
var player1Alive = true
var sword1Thrower = 1
var whichPlatformOn1 = -1

var player2X = canvas.width - player1X - playerWidth
var player2Y = canvas.height - playerHeight
var speed2X = -walkingXSpeed
var speed2Y = 0
var jumping2 = false
var upReleased = true
var sword2X = player2X + playerWidth-swordRadius/2
var sword2Y = player2Y
var sword2SpeedX = 0
var sword2SpeedY = 0
var holding2Player = 2
var player2HasSword = true
var sword2Grounded = false
var sword2 = swordLeftSpr
var player2Alive = true
var sword2Thrower = 2
var whichPlatformOn2 = -1

var swordThrownRightSprSh = []
swordThrownRightSprSh.length = 4
for (i=0; i < swordThrownRightSprSh.length; i++) {
	swordThrownRightSprSh[i] = new Image()
	swordThrownRightSprSh[i].src = " sprites/pirate_sword_thrown ("+i.toString()+").png"
}
var throw1Anim = 0
var throw2Anim = 0
var swordGroundedRightSpr = new Image()
swordGroundedRightSpr.src = "sprites/pirate_sword_grounded_right.png"
var swordGroundedLeftSpr = new Image()
swordGroundedLeftSpr.src = "sprites/pirate_sword_grounded_left.png"

var platforms = []
var platformWidth = 100
var platformHeight = 10
platforms.length = 3
platforms[0] = {x: 50, y: canvas.height-80, w: platformWidth, h: platformHeight}
platforms[1] = {x: canvas.width-50-platformWidth, y: canvas.height-80, w: platformWidth, h: platformHeight}
platforms[2] = {x: (canvas.width-platformWidth)/2, y: canvas.height-160, w: platformWidth, h: platformHeight}

function drawPlatforms() {
	for (i=0; i<platforms.length; i++) {
		ctx.beginPath()
		ctx.rect(platforms[i].x, platforms[i].y, platforms[i].w, platforms[i].h)
		ctx.fillStyle = "#682404"
		ctx.fill()
		ctx.closePath()
	}
}

function reset() {
	paused = false
	player1X = 50
	player1Y = canvas.height - playerHeight
	speed1X = walkingXSpeed
	speed1Y = 0
	jumping1 = false
	wReleased = true
	sword1X = player1X-swordRadius/2
	sword1Y = player1Y - swordRadius
	sword1SpeedX = 0
	sword1SpeedY = 0
	holding1Player = 1
	player1HasSword = true
	sword1Grounded = false
	sword1 = swordRightSpr
	player1Alive = true
	sword1Thrower = 1
	whichPlatformOn1 = -1

	player2X = canvas.width - player1X - playerWidth
	player2Y = canvas.height - playerHeight
	speed2X = -walkingXSpeed
	speed2Y = 0
	jumping2 = false
	upReleased = true
	sword2X = player2X + playerWidth-swordRadius/2
	sword2Y = player2Y - swordRadius
	sword2SpeedX = 0
	sword2SpeedY = 0
	holding2Player = 2
	player2HasSword = true
	sword2Grounded = false
	sword2 = swordLeftSpr
	player2Alive = true
	sword2Thrower = 2
	whichPlatformOn1 = -1
	throw1Anim = 0
	throw2Anim = 0
}

document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler)

function keyDownHandler(e) {
	// w pressed
	if (e.keyCode == 87) {
		// if player1 is not jumping yet and doesn't have sword, then jump
		// also make sure user has released w from previous jump to prevent user from holding down w
		if (!jumping1 && wReleased && !player1HasSword) {
			jumping1 = true
			speed1Y = -jumpPower
			wReleased = false
			whichPlatformOn1 = -1
		} // if player1 has a sword, throw it
		else if (player1HasSword) {
			player1HasSword = false
			if (holding1Player == 1) {
				throw1Anim = 0
				if (speed1X > 0) {
					sword1SpeedX = throwPower
				} else {
					sword1SpeedX = -throwPower
				}
				sword1SpeedY = -throwPower
				holding1Player = 0
				sword1Thrower = 1
			} else {
				throw2Anim = 0
				if (speed1X > 0) {
					sword2SpeedX = throwPower
				} else {
					sword2SpeedX = -throwPower
				}
				sword2SpeedY = -throwPower
				holding2Player = 0
				sword2Thrower = 1
			}
		}
	} // up pressed
	else if (e.keyCode == 38) {
		if (!jumping2 && upReleased && !player2HasSword) {
			jumping2 = true
			speed2Y = -jumpPower
			upReleased = false
			whichPlatformOn2 = -1
		} else if (player2HasSword) {
			player2HasSword = false
			throw1Anim = 0
			if (holding1Player == 2) {
				throw1Anim = 0
				if (speed2X > 0) {
					sword1SpeedX = throwPower
				} else {
					sword1SpeedX = -throwPower
				}
				sword1SpeedY = -throwPower
				holding1Player = 0
				sword1Thrower = 2
			} else {
				throw2Anim = 0
				if (speed2X > 0) {
					sword2SpeedX = throwPower
				} else {
					sword2SpeedX = -throwPower
				}
				sword2SpeedY = -throwPower
				holding2Player = 0
				sword2Thrower = 2
			}
		}
	} // p pressed
	else if (e.keyCode == 80) {
		togglePause()
	} // c pressed
	else if (e.keyCode == 67) {
		if (!player1Alive || !player2Alive) {
			reset()
			requestAnimationFrame(draw)
		}
	}
}

function keyUpHandler(e) {
	// w released
	if (e.keyCode == 87) {
		wReleased = true
	} else if (e.keyCode == 38) {
		upReleased = true
	}
}

function togglePause() {
	if (!paused) {
		paused = true
	} else if (player1Alive && player2Alive) {
		paused = false
		requestAnimationFrame(draw)
	}
}

function drawPlayer1() {
	ctx.beginPath()
	ctx.rect(player1X, player1Y, playerWidth, playerHeight)
	ctx.fillStyle = "#1BA8F1"
	ctx.fill()
	ctx.closePath()
}

function drawPlayer2() {
	ctx.beginPath()
	ctx.rect(player2X, player2Y, playerWidth, playerHeight)
	ctx.fillStyle = "#CB1D1D"
	ctx.fill()
	ctx.closePath()
}

function drawSword1() {
	ctx.drawImage(sword1,sword1X,sword1Y,swordRadius,swordRadius)
}

function drawSword2() {
	ctx.drawImage(sword2,sword2X,sword2Y,swordRadius,swordRadius)
}

function detectCollision() {
	// if player1 collides with sword1, sword1 is grounded, and player doesn't have a sword, pick up the sword
	if (player1X < sword1X + swordRadius &&
		player1X + playerWidth > sword1X &&
		player1Y < sword1Y + swordRadius &&
		player1Y + playerHeight > sword1Y && 
		sword1Grounded && !player1HasSword) {
			player1HasSword = true
			sword1Grounded = false
			holding1Player = 1
	} else if (player1X < sword2X + swordRadius &&
		player1X + playerWidth > sword2X &&
		player1Y < sword2Y + swordRadius &&
		player1Y + playerHeight > sword2Y && 
		sword2Grounded && !player1HasSword) {
			player1HasSword = true
			sword2Grounded = false
			holding2Player = 1
	} else if (player2X < sword1X + swordRadius &&
		player2X + playerWidth > sword1X &&
		player2Y < sword1Y + swordRadius &&
		player2Y + playerHeight > sword1Y && 
		sword1Grounded && !player2HasSword) {
			player2HasSword = true
			sword1Grounded = false
			holding1Player = 2
	} else if (player2X < sword2X + swordRadius &&
		player2X + playerWidth > sword2X &&
		player2Y < sword2Y + swordRadius &&
		player2Y + playerHeight > sword2Y && 
		sword2Grounded && !player2HasSword) {
			player2HasSword = true
			sword2Grounded = false
			holding2Player = 2
	} // if player1 collides with sword1 and sword1 is being thrown, player1 loses
	else if (player1X < sword1X + swordRadius &&
		player1X + playerWidth > sword1X &&
		player1Y < sword1Y + swordRadius &&
		player1Y + playerHeight > sword1Y && 
		!sword1Grounded && holding1Player == 0 && sword1Thrower == 2) {
			player1Alive = false
	} else if (player1X < sword2X + swordRadius &&
		player1X + playerWidth > sword2X &&
		player1Y < sword2Y + swordRadius &&
		player1Y + playerHeight > sword2Y && 
		!sword2Grounded && holding2Player == 0 && sword2Thrower == 2) {
			player1Alive = false
	} else if (player2X < sword1X + swordRadius &&
		player2X + playerWidth > sword1X &&
		player2Y < sword1Y + swordRadius &&
		player2Y + playerHeight > sword1Y && 
		!sword1Grounded && holding1Player == 0 && sword1Thrower == 1) {
			player2Alive = false
	} else if (player2X < sword2X + swordRadius &&
		player2X + playerWidth > sword2X &&
		player2Y < sword2Y + swordRadius &&
		player2Y + playerHeight > sword2Y && 
		!sword2Grounded && holding2Player == 0 && sword2Thrower == 1) {
			player2Alive = false
	}
}

function detectPlatformCollisions() {
	for (i=0; i<platforms.length; i++) {
		if (player1X > platforms[i].x - playerWidth && player1X < platforms[i].x + platforms[i].w &&
			player1Y + playerHeight > platforms[i].y && player1Y + playerHeight < platforms[i].y + platforms[i].h &&
			speed1Y >= 0) {
			player1Y = platforms[i].y - playerHeight
			speed1Y = 0
			jumping1 = false
			whichPlatformOn1 = i
		}
		if (player2X > platforms[i].x - playerWidth && player2X < platforms[i].x + platforms[i].w &&
			player2Y + playerHeight > platforms[i].y && player2Y + playerHeight < platforms[i].y + platforms[i].h &&
			speed2Y >= 0) {
			player2Y = platforms[i].y - playerHeight
			speed2Y = 0
			jumping2 = false
			whichPlatformOn2 = i
		}
		if (sword1X > platforms[i].x - swordRadius && sword1X < platforms[i].x + platforms[i].w &&
			sword1Y + swordRadius > platforms[i].y && sword1Y + swordRadius < platforms[i].y + platforms[i].h &&
			sword1SpeedY > 0) {
			sword1Grounded = true
			sword1Y = platforms[i].y - swordRadius
			if (sword1SpeedX > 0) {
				sword1 = swordGroundedRightSpr
			} else {
				sword1 = swordGroundedLeftSpr
			}
			sword1SpeedX = 0
			sword1SpeedY = 0
		}
		if (sword2X > platforms[i].x - swordRadius && sword2X < platforms[i].x + platforms[i].w &&
			sword2Y + swordRadius > platforms[i].y && sword2Y + swordRadius < platforms[i].y + platforms[i].h &&
			sword2SpeedY > 0) {
			sword2Grounded = true
			sword2Y = platforms[i].y - swordRadius
			if (sword2SpeedX > 0) {
				sword2 = swordGroundedRightSpr
			} else {
				sword2 = swordGroundedLeftSpr
			}
			sword2SpeedX = 0
			sword2SpeedY = 0
		}
	}
}

function platformHandler() {
	 if (whichPlatformOn1 != -1) {
	 	if (player1X < platforms[whichPlatformOn1].x - playerWidth
	 		|| player1X > platforms[whichPlatformOn1].x + platforms[whichPlatformOn1].w) {
			whichPlatformOn1 = -1
			jumping1 = true
			speed1Y = 1
		}
	}
	if (whichPlatformOn2 != -1) {
	 	if (player2X < platforms[whichPlatformOn2].x - playerWidth
	 		|| player2X > platforms[whichPlatformOn2].x + platforms[whichPlatformOn2].w) {
			whichPlatformOn2 = -1
			jumping2 = true
			speed2Y = 1
		}
	}
}

function player1SwordHandler() {
	// if player1 has sword, make sword follow player1
	if (player1HasSword) {
		if (holding1Player == 1) {
			if (speed1X > 0) {
				sword1X = player1X-swordRadius/2
				sword1 = swordRightSpr
			} else {
				sword1X = player1X + playerWidth-swordRadius/2
				sword1 = swordLeftSpr
			}
			sword1Y = player1Y - swordRadius
		} else {
			if (speed1X > 0) {
				sword2X = player1X-swordRadius/2
				sword2 = swordRightSpr
			} else {
				sword2X = player1X + playerWidth-swordRadius/2
				sword2 = swordLeftSpr
			}
			sword2Y = player1Y - swordRadius
		}

	}
}

function player2SwordHandler() {
	if (player2HasSword) {
		if (holding1Player == 2) {
			if (speed2X > 0) {
				sword1X = player2X-swordRadius/2
				sword1 = swordRightSpr
			} else {
				sword1X = player2X + playerWidth-swordRadius/2
				sword1 = swordLeftSpr
			}
			sword1Y = player2Y - swordRadius
		} else {
			if (speed2X > 0) {
				sword2X = player2X-swordRadius/2
				sword2 = swordRightSpr
			} else {
				sword2X = player2X + playerWidth-swordRadius/2
				sword2 = swordLeftSpr
			}
			sword2Y = player2Y - swordRadius
		}

	}
}

function sword1Handler() {
	sword1X += sword1SpeedX
	sword1Y += sword1SpeedY
	// sword is being thrown
	if (holding1Player == 0 && !sword1Grounded) {
		sword1SpeedY += gravity
		sword1 = swordThrownRightSprSh[throw1Anim]
		throw1Anim++
		if (throw1Anim >= swordThrownRightSprSh.length) {
			throw1Anim = 0
		}
	}
	// flip direction of sword1 when it gets to edge
	if (sword1X+sword1SpeedX < 0) {
		sword1SpeedX = -sword1SpeedX
		sword1 = swordRightSpr
	} else if (sword1X+sword1SpeedX > canvas.width-swordRadius) {
		sword1SpeedX = -sword1SpeedX
		sword1 = swordLeftSpr
	}
	// if sword1 reaches the ground, stop its movement
	if (sword1Y+sword1SpeedY > canvas.height - swordRadius) {
		sword1Grounded = true
		sword1Y = canvas.height - swordRadius
		if (sword1SpeedX > 0) {
			sword1 = swordGroundedRightSpr
		} else {
			sword1 = swordGroundedLeftSpr
		}
		sword1SpeedX = 0
		sword1SpeedY = 0
	}
}

function sword2Handler() {
	sword2X += sword2SpeedX
	sword2Y += sword2SpeedY
	if (holding2Player == 0 && !sword2Grounded) {
		sword2SpeedY += gravity
		sword2 = swordThrownRightSprSh[throw2Anim]
		throw2Anim++
		if (throw2Anim >= swordThrownRightSprSh.length) {
			throw2Anim = 0
		}
	}
	if (sword2X+sword2SpeedX < 0) {
		sword2SpeedX = -sword2SpeedX
		sword2 = swordRightSpr
	} else if (sword2X+sword2SpeedX > canvas.width-swordRadius) {
		sword2SpeedX = -sword2SpeedX
		sword2 = swordLeftSpr
	}
	if (sword2Y+sword2SpeedY > canvas.height - swordRadius) {
		sword2Grounded = true
		sword2Y = canvas.height - swordRadius
		if (sword2SpeedX > 0) {
			sword2 = swordGroundedRightSpr
		} else {
			sword2 = swordGroundedLeftSpr
		}
		sword2SpeedX = 0
		sword2SpeedY = 0
	}
}

function checkWin() {
	if (!player1Alive) {
		paused = true
		ctx.font = "30px Verdana"
		ctx.textAlign = "center"
		ctx.fillStyle = "red"
		ctx.fillText("Player 2 Wins!", canvas.width/2, canvas.height/2)
		ctx.font = "20px Verdana"
		ctx.fillText("Press c to continue...", canvas.width/2, canvas.height/2+40)
	} else if (!player2Alive) {
		paused = true
		ctx.font = "30px Verdana"
		ctx.textAlign = "center"
		ctx.fillStyle = "blue"
		ctx.fillText("Player 1 Wins!", canvas.width/2, canvas.height/2)
		ctx.font = "20px Verdana"
		ctx.fillText("Press c to continue...", canvas.width/2, canvas.height/2+40)
	}
}

function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height)
	
	checkWin()
	drawPlayer1()
	player1SwordHandler()
	drawPlayer2()
	player2SwordHandler()
	drawSword1()
	sword1Handler()
	drawSword2()
	sword2Handler()
	drawPlatforms()
	detectCollision()
	detectPlatformCollisions()
	platformHandler()
	

	player1X += speed1X
	// flip direction when player1 reaches edge
	if (player1X + speed1X < 0 || player1X + speed1X > canvas.width-playerWidth) {
		speed1X = -speed1X
	}

	// player1 jumping code
	player1Y += speed1Y
	if (jumping1) {
		if (speed1X > 0) {
			speed1X = jumpingXSpeed
		} else {
			speed1X = -jumpingXSpeed
		}
		speed1Y += gravity
	}
	// when player1 reaches ground, stop jumping
	if (player1Y + speed1Y > canvas.height - playerHeight) {
		player1Y = canvas.height - playerHeight
		jumping1 = false
		speed1Y = 0
		if (speed1X > 0) {
			speed1X = walkingXSpeed
		} else {
			speed1X = -walkingXSpeed
		}
	}

	player2X += speed2X
	if (player2X + speed2X < 0 || player2X + speed2X > canvas.width-playerWidth) {
		speed2X = -speed2X
	}
	player2Y += speed2Y
	if (jumping2) {
		if (speed2X > 0) {
			speed2X = jumpingXSpeed
		} else {
			speed2X = -jumpingXSpeed
		}
		speed2Y += gravity
	}
	if (player2Y + speed2Y > canvas.height - playerHeight) {
		player2Y = canvas.height - playerHeight
		jumping2 = false
		speed2Y = 0
		if (speed2X > 0) {
			speed2X = walkingXSpeed
		} else {
			speed2X = -walkingXSpeed
		}
	}

	if (!paused) {
		requestAnimationFrame(draw)
	}

}

draw()