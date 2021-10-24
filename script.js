var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')
var fps, fpsInterval, startTime, now, then, elapsed
var jumpSound = new Audio("audio/jump.mp3")
var throwSound = new Audio("audio/throw.mp3")
var pickupSound = new Audio("audio/pickup.wav")
var hitgroundSound = new Audio("audio/hitground.wav")
var running1 = new Audio("audio/running.flac")
var running2 = new Audio("audio/running.flac")
running1.loop = true
running2.loop = true
var deathSound = new Audio("audio/death.wav")
var started = false
var gameEnd = false
var deathSoundPlayed = false
var ground = new Image()
ground.src = "sprites/ground.png"
var groundHeight = 52
var fps = 30

var gravity = 1
var playerWidth = 75
var playerHeight = 75
var paused = false
var jumpingXSpeed = 5.5
var walkingXSpeed = 6
var throwPower = 13
var throwXSpeedFactor = 1.8
var jumpPower = 13
var swordRadius = 45
var playerXOffset = 24
var playerYOffset = 12
var maxAngle = 120
var minAngle = -20
var crossHairDistance = 40
var crossHairSize = 20
var crossHair = new Image()
crossHair.src = "sprites/crosshair.png"


var player1X = 50
var player1Y = canvas.height - playerHeight - groundHeight
var speed1X = walkingXSpeed
var speed1Y = 0
var jumping1 = false
var wReleased = true
var sword1X = player1X-swordRadius/2
var sword1Y = player1Y
var sword1SpeedX = 0
var sword1SpeedY = 0
var holding1Player = 1
var player1HasSword = true
var sword1Grounded = false
var swordRightSpr = new Image()
swordRightSpr.src = "sprites/bone_thrown (3).png"
var swordLeftSpr = new Image()
swordLeftSpr.src = "sprites/bone_thrown (3).png"
var sword1 = swordRightSpr
var player1Alive = true
var sword1Thrower = 1
var whichPlatformOn1 = -1
var throwAngle1 = 45
var angleChange1 = 5

var player2X = canvas.width - player1X - playerWidth
var player2Y = canvas.height - playerHeight - groundHeight
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
var throwAngle2 = 45
var angleChange2 = 5

var swordThrownRightSprSh = []
swordThrownRightSprSh.length = 4
for (i=0; i < swordThrownRightSprSh.length; i++) {
	swordThrownRightSprSh[i] = new Image()
	swordThrownRightSprSh[i].src = "sprites/bone_thrown ("+i.toString()+").png"
}
var throw1Anim = 0
var throw2Anim = 0
var swordGroundedRightSpr = new Image()
swordGroundedRightSpr.src = "sprites/bone_grounded.png"
var swordGroundedLeftSpr = new Image()
swordGroundedLeftSpr.src = "sprites/bone_grounded.png"

var runAnim1 = 0
var runAnim2 = 0
var runLeft = []
runLeft.length = 8
var runRight = []
runRight.length = 8
var runWithBoneLeft = []
runWithBoneLeft.length = 8
var runWithBoneRight = []
runWithBoneRight.length = 8
for (i=0; i<runWithBoneLeft.length; i++) {
	runLeft[i] = new Image()
	runLeft[i].src = "sprites/running ("+i.toString()+").png"
	runRight[i] = new Image()
	runRight[i].src = "sprites/running_right ("+i.toString()+").png"
	runWithBoneLeft[i] = new Image()
	runWithBoneLeft[i].src = "sprites/running_with_bone ("+i.toString()+").png"
	runWithBoneRight[i] = new Image()
	runWithBoneRight[i].src = "sprites/running_with_bone_right ("+i.toString()+").png"
}


var boneLanded = []
boneLanded.length = 6
var boneLanded1Anim = boneLanded.length
var boneLanded2Anim = boneLanded.length
for (i=0; i<boneLanded.length; i++) {
	boneLanded[i] = new Image()
	boneLanded[i].src = "sprites/bone_landed 0"+i.toString()+".png"
}

var deathAnim = 0
var death = []
var deathRight = []
death.length = 4
deathRight.length = 4
for (i=0; i<death.length; i++) {
	death[i] = new Image()
	death[i].src = "sprites/death 0"+i.toString()+".png"
	deathRight[i] = new Image()
	deathRight[i].src = "sprites/death_right 0"+i.toString()+".png"
}

var player1 = runWithBoneRight[0]
var player2 = runWithBoneLeft[0]

var floatingPlatform = new Image()
floatingPlatform.src = "sprites/floating_platform.png"
var groundPlatform = new Image()
groundPlatform.src = "sprites/ground_platform.png"

var stages = []
stages.length = 3
var stage = Math.floor(Math.random() * stages.length)
var platforms1 = []
var floatingPlatformWidth = 150
var floatingPlatformHeight = 20
var groundPlatformWidth = 170
var groundPlatformHeight = 198

platforms1.length = 9
platforms1[0] = {img: groundPlatform, x: -30, y: 200, w: groundPlatformWidth, h: groundPlatformHeight}
platforms1[1] = {img: groundPlatform, x: 70, y: 260, w: groundPlatformWidth, h: groundPlatformHeight}
platforms1[2] = {img: groundPlatform, x: 170, y: 320, w: groundPlatformWidth, h: groundPlatformHeight}
platforms1[3] = {img: groundPlatform, x: canvas.width+30-groundPlatformWidth, y: 200, w: groundPlatformWidth, h: groundPlatformHeight}
platforms1[4] = {img: groundPlatform, x: canvas.width-70-groundPlatformWidth, y: 260, w: groundPlatformWidth, h: groundPlatformHeight}
platforms1[5] = {img: groundPlatform, x: canvas.width-170-groundPlatformWidth, y: 320, w: groundPlatformWidth, h: groundPlatformHeight}
platforms1[6] = {img: floatingPlatform, x: (canvas.width-floatingPlatformWidth)/2, y: 210, w: floatingPlatformWidth, h: floatingPlatformHeight}
platforms1[7] = {img: floatingPlatform, x: 120, y: 140, w: floatingPlatformWidth, h: floatingPlatformHeight}
platforms1[8] = {img: floatingPlatform, x: canvas.width-120-floatingPlatformWidth, y: 140, w: floatingPlatformWidth, h: floatingPlatformHeight}
stages[0] = platforms1

var platforms2 = []
platforms2.length = 7
platforms2[0] = {img: groundPlatform, x: 100, y: 200, w: groundPlatformWidth, h: groundPlatformHeight}
platforms2[1] = {img: groundPlatform, x: -30, y: 280, w: groundPlatformWidth, h: groundPlatformHeight}
platforms2[2] = {img: groundPlatform, x: 190, y: 320, w: groundPlatformWidth, h: groundPlatformHeight}
platforms2[3] = {img: groundPlatform, x: 680, y: 260, w: groundPlatformWidth, h: groundPlatformHeight}
platforms2[4] = {img: groundPlatform, x: 600, y: 320, w: groundPlatformWidth, h: groundPlatformHeight}
platforms2[5] = {img: floatingPlatform, x: 380, y: 240, w: floatingPlatformWidth, h: floatingPlatformHeight}
platforms2[6] = {img: floatingPlatform, x: 500, y: 160, w: floatingPlatformWidth, h: floatingPlatformHeight}
stages[1] = platforms2

var platforms3 = []
platforms3.length = 8
platforms3[0] = {img: groundPlatform, x: -30, y: 200, w: groundPlatformWidth, h: groundPlatformHeight}
platforms3[1] = {img: groundPlatform, x: 100, y: 260, w: groundPlatformWidth, h: groundPlatformHeight}
platforms3[2] = {img: groundPlatform, x: -10, y: 320, w: groundPlatformWidth, h: groundPlatformHeight}
platforms3[3] = {img: groundPlatform, x: canvas.width-70-groundPlatformWidth, y: 260, w: groundPlatformWidth, h: groundPlatformHeight}
platforms3[4] = {img: groundPlatform, x: canvas.width-groundPlatformWidth, y: 320, w: groundPlatformWidth, h: groundPlatformHeight}
platforms3[5] = {img: floatingPlatform, x: (canvas.width-floatingPlatformWidth)/2, y: 190, w: floatingPlatformWidth, h: floatingPlatformHeight}
platforms3[6] = {img: floatingPlatform, x: 120, y: 140, w: floatingPlatformWidth, h: floatingPlatformHeight}
platforms3[7] = {img: floatingPlatform, x: canvas.width-100-floatingPlatformWidth, y: 160, w: floatingPlatformWidth, h: floatingPlatformHeight}
stages[2] = platforms3

var platforms = stages[stage]

function drawPlatforms() {
	for (i=0; i<platforms.length; i++) {
		ctx.drawImage(platforms[i].img, platforms[i].x, platforms[i].y, platforms[i].w, platforms[i].h)
	}
}

function drawGround() {
	ctx.drawImage(ground, 0, canvas.height - 52, canvas.width, 52)
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    draw();
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
	running1.currentTime = 0
	running2.currentTime = 0
	running1.play()
	running2.play()
	deathAnim = 0
	gameEnd = false
	deathSoundPlayed = false
	throwAngle1 = 45
	angleChange1 = 10

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
	runAnim1 = 0
	runAnim2 = 0
	player1 = runWithBoneRight[0]
	player2 = runWithBoneLeft[0]
	throwAngle2 = 45
	angleChange2 = 10
	boneLanded1Anim = boneLanded.length
	boneLanded2Anim = boneLanded.length

	stage = Math.floor(Math.random() * stages.length)
	platforms = stages[stage]
}

document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler)

function keyDownHandler(e) {
	// w pressed
	if (e.keyCode == 87 && started && !paused && player1Alive) {
		// if player1 is not jumping yet and doesn't have sword, then jump
		// also make sure user has released w from previous jump to prevent user from holding down w
		if (!jumping1 && wReleased && !player1HasSword) {
			jumping1 = true
			speed1Y = -jumpPower
			wReleased = false
			jumpSound.cloneNode().play()
			running1.pause()
		} // if player1 has a sword, throw it
		else if (player1HasSword) {
			player1HasSword = false
			if (holding1Player == 1) {
				throw1Anim = 0
				if (speed1X > 0) {
					sword1SpeedX = throwPower * Math.cos(toRadians(throwAngle1)) * throwXSpeedFactor
				} else {
					sword1SpeedX = -(throwPower * Math.cos(toRadians(throwAngle1))) * throwXSpeedFactor
				}
				sword1SpeedY = -(throwPower * Math.sin(toRadians(throwAngle1)))
				holding1Player = 0
				sword1Thrower = 1
			} else {
				throw2Anim = 0
				if (speed1X > 0) {
					sword2SpeedX = throwPower * Math.cos(toRadians(throwAngle1)) * throwXSpeedFactor
				} else {
					sword2SpeedX = -(throwPower * Math.cos(toRadians(throwAngle1))) * throwXSpeedFactor
				}
				sword2SpeedY = -(throwPower * Math.sin(toRadians(throwAngle1)))
				holding2Player = 0
				sword2Thrower = 1
			}
			throwSound.cloneNode().play()
		}
	} // up pressed
	else if (e.keyCode == 38 && started && !paused && player2Alive) {
		if (!jumping2 && upReleased && !player2HasSword) {
			jumping2 = true
			speed2Y = -jumpPower
			upReleased = false
			whichPlatformOn2 = -1
			jumpSound.cloneNode().play()
			running2.pause()
		} else if (player2HasSword) {
			player2HasSword = false
			throw1Anim = 0
			if (holding1Player == 2) {
				throw1Anim = 0
				if (speed2X > 0) {
					sword1SpeedX = throwPower * Math.cos(toRadians(throwAngle2)) * throwXSpeedFactor
				} else {
					sword1SpeedX = -(throwPower * Math.cos(toRadians(throwAngle2))) * throwXSpeedFactor
				}
				sword1SpeedY = -throwPower
				holding1Player = 0
				sword1Thrower = 2
			} else {
				throw2Anim = 0
				if (speed2X > 0) {
					sword2SpeedX = throwPower * Math.cos(toRadians(throwAngle2)) * throwXSpeedFactor
				} else {
					sword2SpeedX = -(throwPower * Math.cos(toRadians(throwAngle2))) * throwXSpeedFactor
				}
				sword2SpeedY = -(throwPower * Math.sin(toRadians(throwAngle2)))
				holding2Player = 0
				sword2Thrower = 2
			}
			throwSound.cloneNode().play()
		}
	}
	else if (e.keyCode == 83) {
		speed1X = -speed1X
	}
	else if (e.keyCode == 40) {
		speed2X = -speed2X
	} // p pressed
	else if (e.keyCode == 80) {
		togglePause()
	} // c pressed
	else if (e.keyCode == 67) {
		if (!player1Alive || !player2Alive) {
			reset()
			startAnimating(fps)
		}
	}
}

function keyUpHandler(e) {
	// w released
	if (e.keyCode == 87  && started && !paused) {
		wReleased = true
	} else if (e.keyCode == 38  && started && !paused) {
		upReleased = true
	}
}

function togglePause() {
	if (!started) {
		started = true
		running1.play()
		running2.play()
		startAnimating(fps)
	} else if (!paused && player1Alive && player2Alive) {
		running1.pause()
		running2.pause()
		paused = true
	} else if (player1Alive && player2Alive) {
		paused = false
		running1.play()
		running2.play()
		requestAnimationFrame(draw)
	}
}

function drawPlayer1() {
	if (!gameEnd || player1Alive) {
		ctx.drawImage(player1,player1X,player1Y,playerWidth,playerHeight)
	}
}

function drawPlayer2() {
	if (!gameEnd || player2Alive) {
		ctx.drawImage(player2,player2X,player2Y,playerWidth,playerHeight)
	}
}

function drawSword1() {
	if (holding1Player == 0) {
		ctx.drawImage(sword1,sword1X,sword1Y,swordRadius,swordRadius)
	}
}

function drawSword2() {
	if (holding2Player == 0) {
		ctx.drawImage(sword2,sword2X,sword2Y,swordRadius,swordRadius)
	}
}

function drawCrossHair1() {
	if ((holding1Player == 1 || holding2Player == 1) && player1Alive) {
		if (speed1X > 0) {
			var x = player1X + playerWidth/2 - crossHairSize/2 + crossHairDistance * Math.cos(toRadians(throwAngle1))
			var y = player1Y + playerYOffset - crossHairSize/2 - crossHairDistance * Math.sin(toRadians(throwAngle1))
			ctx.drawImage(crossHair,x,y,crossHairSize,crossHairSize)
		} else {
			var x = player1X + playerWidth/2 - crossHairSize/2 - crossHairDistance * Math.cos(toRadians(throwAngle1))
			var y = player1Y + playerYOffset - crossHairSize/2 - crossHairDistance * Math.sin(toRadians(throwAngle1))
			ctx.drawImage(crossHair,x,y,crossHairSize,crossHairSize)
		}
	}
}

function drawCrossHair2() {
	if ((holding1Player == 2 || holding2Player == 2) && player2Alive) {
		if (speed2X > 0) {
			var x = player2X + playerWidth/2 - crossHairSize/2 + crossHairDistance * Math.cos(toRadians(throwAngle2))
			var y = player2Y + playerYOffset - crossHairSize/2 - crossHairDistance * Math.sin(toRadians(throwAngle2))
			ctx.drawImage(crossHair,x,y,crossHairSize,crossHairSize)
		} else {
			var x = player2X + playerWidth/2 - crossHairSize/2 - crossHairDistance * Math.cos(toRadians(throwAngle2))
			var y = player2Y + playerYOffset - crossHairSize/2 - crossHairDistance * Math.sin(toRadians(throwAngle2))
			ctx.drawImage(crossHair,x,y,crossHairSize,crossHairSize)
		}
	}
}

function updateThrowAngle1() {
	if (throwAngle1 + angleChange1 > maxAngle || throwAngle1 + angleChange1 < minAngle) {
		angleChange1 = -angleChange1
	}
	throwAngle1 += angleChange1
}

function updateThrowAngle2() {
	if (throwAngle2 + angleChange2 > maxAngle || throwAngle2 + angleChange2 < minAngle) {
		angleChange2 = -angleChange2
	}
	throwAngle2 += angleChange2
}

function detectCollision() {
	// if player1 collides with sword1, sword1 is grounded, and player doesn't have a sword, pick up the sword
	if (player1X + playerXOffset < sword1X + swordRadius &&
		player1X + playerWidth - playerXOffset > sword1X &&
		player1Y + playerYOffset < sword1Y + swordRadius &&
		player1Y + playerHeight > sword1Y && 
		sword1Grounded && !player1HasSword && player1Alive) {
			player1HasSword = true
			sword1Grounded = false
			holding1Player = 1
			throwAngle1 = 45
			pickupSound.cloneNode().play()
	} else if (player1X + playerXOffset < sword2X + swordRadius &&
		player1X + playerWidth - playerXOffset > sword2X &&
		player1Y + playerYOffset < sword2Y + swordRadius &&
		player1Y + playerHeight > sword2Y && 
		sword2Grounded && !player1HasSword && player1Alive) {
			player1HasSword = true
			sword2Grounded = false
			holding2Player = 1
			throwAngle1 = 45
			pickupSound.cloneNode().play()
	} else if (player2X + playerXOffset < sword1X + swordRadius &&
		player2X + playerWidth - playerXOffset > sword1X &&
		player2Y + playerYOffset< sword1Y + swordRadius &&
		player2Y + playerHeight > sword1Y && 
		sword1Grounded && !player2HasSword && player2Alive) {
			player2HasSword = true
			sword1Grounded = false
			holding1Player = 2
			throwAngle2 = 45
			pickupSound.cloneNode().play()
	} else if (player2X + playerXOffset < sword2X + swordRadius &&
		player2X + playerWidth - playerXOffset > sword2X &&
		player2Y + playerYOffset < sword2Y + swordRadius &&
		player2Y + playerHeight > sword2Y && 
		sword2Grounded && !player2HasSword && player2Alive) {
			player2HasSword = true
			sword2Grounded = false
			holding2Player = 2
			throwAngle2 = 45
			pickupSound.cloneNode().play()
	} // if player1 collides with sword1 and sword1 is being thrown, player1 loses
	else if (player1X + playerXOffset < sword1X + swordRadius &&
		player1X + playerWidth - playerXOffset > sword1X &&
		player1Y + playerYOffset < sword1Y + swordRadius &&
		player1Y + playerHeight > sword1Y && 
		!sword1Grounded && holding1Player == 0 && sword1Thrower == 2 && player2Alive) {
			player1Alive = false
	} else if (player1X + playerXOffset < sword2X + swordRadius &&
		player1X + playerWidth - playerXOffset > sword2X &&
		player1Y + playerYOffset < sword2Y + swordRadius &&
		player1Y + playerHeight > sword2Y && 
		!sword2Grounded && holding2Player == 0 && sword2Thrower == 2 && player2Alive) {
			player1Alive = false
	} else if (player2X + playerXOffset < sword1X + swordRadius &&
		player2X + playerWidth - playerXOffset > sword1X &&
		player2Y + playerYOffset < sword1Y + swordRadius &&
		player2Y + playerHeight > sword1Y && 
		!sword1Grounded && holding1Player == 0 && sword1Thrower == 1 && player1Alive) {
			player2Alive = false
	} else if (player2X + playerXOffset < sword2X + swordRadius &&
		player2X + playerWidth - playerXOffset > sword2X &&
		player2Y + playerYOffset < sword2Y + swordRadius &&
		player2Y + playerHeight > sword2Y && 
		!sword2Grounded && holding2Player == 0 && sword2Thrower == 1 && player1Alive) {
			player2Alive = false
	}
}

function detectPlatformCollisions() {
	for (i=0; i<platforms.length; i++) {
		if (player1X > platforms[i].x - playerWidth + playerXOffset && player1X < platforms[i].x + platforms[i].w - playerXOffset &&
			player1Y + playerHeight > platforms[i].y-20 && player1Y + playerHeight < platforms[i].y &&
			speed1Y >= 0 && player1Alive) {
			player1Y = platforms[i].y - playerHeight
			speed1Y = 0
			jumping1 = false
			whichPlatformOn1 = i
			running1.play()
		}
		if (player2X > platforms[i].x - playerWidth + playerXOffset && player2X < platforms[i].x + platforms[i].w - playerXOffset &&
			player2Y + playerHeight > platforms[i].y-20 && player2Y + playerHeight < platforms[i].y &&
			speed2Y >= 0 && player2Alive) {
			player2Y = platforms[i].y - playerHeight
			speed2Y = 0
			jumping2 = false
			whichPlatformOn2 = i
			running2.play()
		}
		if (sword1X > platforms[i].x && sword1X + swordRadius < platforms[i].x + platforms[i].w &&
			sword1Y + swordRadius > platforms[i].y-20 && sword1Y + swordRadius < platforms[i].y &&
			sword1SpeedY > 0) {
			sword1Grounded = true
			boneLanded1Anim = 0
			sword1Y = platforms[i].y - swordRadius
			if (sword1SpeedX > 0) {
				sword1 = swordGroundedRightSpr
			} else {
				sword1 = swordGroundedLeftSpr
			}
			sword1SpeedX = 0
			sword1SpeedY = 0
			hitgroundSound.cloneNode().play()
		}
		if (sword2X > platforms[i].x && sword2X + swordRadius < platforms[i].x + platforms[i].w &&
			sword2Y + swordRadius > platforms[i].y-20 && sword2Y + swordRadius < platforms[i].y &&
			sword2SpeedY > 0) {
			sword2Grounded = true
			boneLanded2Anim = 0
			sword2Y = platforms[i].y - swordRadius
			if (sword2SpeedX > 0) {
				sword2 = swordGroundedRightSpr
			} else {
				sword2 = swordGroundedLeftSpr
			}
			sword2SpeedX = 0
			sword2SpeedY = 0
			hitgroundSound.cloneNode().play()
		}
	}
}

function platformHandler() {
	if (whichPlatformOn2 != -1) {
	 	if ((player2X < platforms[whichPlatformOn2].x - playerWidth + playerXOffset
	 		|| player2X > platforms[whichPlatformOn2].x + platforms[whichPlatformOn2].w - playerXOffset)
	 		&& !jumping2) {
			whichPlatformOn2 = -1
			jumping2 = true
			speed2Y = 1
			running2.pause()
		}
	}
	 if (whichPlatformOn1 != -1) {
	 	if ((player1X < platforms[whichPlatformOn1].x - playerWidth + playerXOffset
	 		|| player1X > platforms[whichPlatformOn1].x + platforms[whichPlatformOn1].w - playerXOffset)
	 		&& !jumping1) {
			whichPlatformOn1 = -1
			jumping1 = true
			speed1Y = 1
			running1.pause()
		}
	}
	
}

function player1SwordHandler() {
	// if player1 has sword, make sword follow player1
	if (player1HasSword) {
		if (holding1Player == 1) {
			if (speed1X > 0) {
				sword1X = player1X + (playerWidth - swordRadius)/2
				sword1 = swordRightSpr
			} else {
				sword1X = player1X + (playerWidth-swordRadius)/2
				sword1 = swordLeftSpr
			}
			sword1Y = player1Y - swordRadius + playerYOffset
		} else {
			if (speed1X > 0) {
				sword2X = player1X + (playerWidth - swordRadius)/2
				sword2 = swordRightSpr
			} else {
				sword2X = player1X + (playerWidth - swordRadius)/2
				sword2 = swordLeftSpr
			}
			sword2Y = player1Y - swordRadius + playerYOffset
		}
		if (speed1X > 0) {
			runAnim1++
			if (runAnim1 >= runWithBoneRight.length) {
				runAnim1 = 0
			}
			player1 = runWithBoneRight[runAnim1]
		} else {
			runAnim1++
			if (runAnim1 >= runWithBoneLeft.length) {
				runAnim1 = 0
			}
			player1 = runWithBoneLeft[runAnim1]
		}
	} else {
		if (speed1X > 0) {
			runAnim1++
			if (runAnim1 >= runRight.length) {
				runAnim1 = 0
			}
			player1 = runRight[runAnim1]
		} else {
			runAnim1++
			if (runAnim1 >= runLeft.length) {
				runAnim1 = 0
			}
			player1 = runLeft[runAnim1]
		}
	}
}

function player2SwordHandler() {
	if (player2HasSword) {
		if (holding1Player == 2) {
			if (speed2X > 0) {
				sword1X = player2X + (playerWidth - swordRadius)/2
				sword1 = swordRightSpr
			} else {
				sword1X = player2X + (playerWidth - swordRadius)/2
				sword1 = swordLeftSpr
			}
			sword1Y = player2Y - swordRadius + playerYOffset
		} else {
			if (speed2X > 0) {
				sword2X = player2X + (playerWidth - swordRadius)/2
				sword2 = swordRightSpr
			} else {
				sword2X = player2X + (playerWidth - swordRadius)/2
				sword2 = swordLeftSpr
			}
			sword2Y = player2Y - swordRadius + playerYOffset
		}
		if (speed2X > 0) {
			runAnim2++
			if (runAnim2 >= runWithBoneRight.length) {
				runAnim2 = 0
			}
			player2 = runWithBoneRight[runAnim2]
		} else {
			runAnim2++
			if (runAnim2 >= runWithBoneLeft.length) {
				runAnim2 = 0
			}
			player2 = runWithBoneLeft[runAnim2]
		}
	} else {
		if (speed2X > 0) {
			runAnim2++
			if (runAnim2 >= runRight.length) {
				runAnim2 = 0
			}
			player2 = runRight[runAnim2]
		} else {
			runAnim2++
			if (runAnim2 >= runLeft.length) {
				runAnim2 = 0
			}
			player2 = runLeft[runAnim2]
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
	if (sword1Y+sword1SpeedY > canvas.height - swordRadius - groundHeight) {
		sword1Grounded = true
		sword1Y = canvas.height - swordRadius - groundHeight
		boneLanded1Anim = 0
		if (sword1SpeedX > 0) {
			sword1 = swordGroundedRightSpr
		} else {
			sword1 = swordGroundedLeftSpr
		}
		sword1SpeedX = 0
		sword1SpeedY = 0
		hitgroundSound.cloneNode().play()
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
	if (sword2Y+sword2SpeedY > canvas.height - swordRadius - groundHeight) {
		sword2Grounded = true
		sword2Y = canvas.height - swordRadius - groundHeight
		boneLanded2Anim = 0
		if (sword2SpeedX > 0) {
			sword2 = swordGroundedRightSpr
		} else {
			sword2 = swordGroundedLeftSpr
		}
		sword2SpeedX = 0
		sword2SpeedY = 0
		hitgroundSound.cloneNode().play()
	}
}

function checkWin() {
	if (!player1Alive) {
		running1.pause()
		if (!deathSoundPlayed) {
			deathSound.cloneNode().play()
			deathSoundPlayed = true
		}
		if (speed1X < 0) {
			player1 = death[deathAnim]
			deathAnim++
			if (deathAnim == death.length) {
				gameEnd = true
			}
		} else {
			player1 = deathRight[deathAnim]
			deathAnim++
			if (deathAnim == deathRight.length) {
				gameEnd = true
			}
		}
		
	} else if (!player2Alive) {
		running2.pause()
		if (!deathSoundPlayed) {
			deathSound.cloneNode().play()
			deathSoundPlayed = true
		}
		if (speed2X < 0) {
			player2 = death[deathAnim]
			deathAnim++
			if (deathAnim == death.length) {
				gameEnd = true
			}
		} else {
			player2 = deathRight[deathAnim]
			deathAnim++
			if (deathAnim == death.length) {
				gameEnd = true
			}
		}
	}
	
}

function drawStart() {
	ctx.font = "bold 40px Verdana"
	ctx.textAlign = "center"
	ctx.fillStyle = "black"
	ctx.fillText("Press p to start game", canvas.width/2, canvas.height/2)
}

function draw() {
	if (!paused) {
		requestAnimationFrame(draw)
	}

	now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval) {

  	then = now - (elapsed % fpsInterval);

    ctx.clearRect(0,0,canvas.width,canvas.height)


		checkWin()
		drawPlatforms()
		drawGround()
		drawSword1()
		sword1Handler()
		drawSword2()
		sword2Handler()
		drawPlayer1()
		player1SwordHandler()
		drawPlayer2()
		player2SwordHandler()
		drawCrossHair1()
		drawCrossHair2()
		updateThrowAngle1()
		updateThrowAngle2()
		detectCollision()
		detectPlatformCollisions()
		platformHandler()


		if (gameEnd && player1Alive) {
			ctx.font = "bold 50px Verdana"
			ctx.textAlign = "center"
			ctx.fillStyle = "blue"
			ctx.fillText("Player 1 Wins!", canvas.width/2, canvas.height/2)
			ctx.font = "20px Verdana"
			ctx.fillText("Press c to continue...", canvas.width/2, canvas.height/2+40)
		}

		if (gameEnd && player2Alive) {
		ctx.font = "bold 50px Verdana"
		ctx.textAlign = "center"
		ctx.fillStyle = "red"
		ctx.fillText("Player 2 Wins!", canvas.width/2, canvas.height/2)
		ctx.font = "20px Verdana"
		ctx.fillText("Press c to continue...", canvas.width/2, canvas.height/2+40)
		}
		

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
		if (player1Y + speed1Y > canvas.height - playerHeight - groundHeight) {
			player1Y = canvas.height - playerHeight - groundHeight
			jumping1 = false
			speed1Y = 0
			if (speed1X > 0) {
				speed1X = walkingXSpeed
			} else {
				speed1X = -walkingXSpeed
			}
			running1.play()
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
		if (player2Y + speed2Y > canvas.height - playerHeight - groundHeight) {
			player2Y = canvas.height - playerHeight - groundHeight
			jumping2 = false
			speed2Y = 0
			if (speed2X > 0) {
				speed2X = walkingXSpeed
			} else {
				speed2X = -walkingXSpeed
			}
			running2.play()
		}

		if (sword1Grounded) {
			if (boneLanded1Anim < boneLanded.length) {
				sword1 = boneLanded[boneLanded1Anim]
				boneLanded1Anim++
			} else {
				sword1 = swordGroundedLeftSpr
			}
		}

		if (sword2Grounded) {
			if (boneLanded2Anim < boneLanded.length) {
				sword2 = boneLanded[boneLanded2Anim]
				boneLanded2Anim++
			} else {
				sword2 = swordGroundedLeftSpr
			}
		}

  }

}

drawStart()
