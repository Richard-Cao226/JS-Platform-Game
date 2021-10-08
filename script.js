var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')

var gravity = 0.1
var playerWidth = 20
var playerHeight = 40
var player1X = 50
var player1Y = canvas.height - playerHeight
var speed1X = 2
var speed1Y = 0
var jumping1 = false
var jumpPower = 5
var wReleased = true
var swordRadius = 10
var sword1X = player1X
var sword1Y = player1Y
var sword1SpeedX = 0
var sword1SpeedY = 0
var player1HasSword = true
var throwPower = 5
var sword1Grounded = false

// **need to add code to keep track of which sword each player is controlling**

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
		} // if player1 has a sword, throw it
		else if (player1HasSword) {
			player1HasSword = false
			if (speed1X > 0) {
				sword1SpeedX = throwPower
			} else {
				sword1SpeedX = -throwPower
			}
			sword1SpeedY = -throwPower
		}
	}
}

function keyUpHandler(e) {
	// w released
	if (e.keyCode == 87) {
		wReleased = true
	}
}

function drawPlayer1() {
	ctx.beginPath()
	ctx.rect(player1X, player1Y, playerWidth, playerHeight)
	ctx.fillStyle = "#1BA8F1"
	ctx.fill()
	ctx.closePath()
}

function drawSword1() {
	ctx.beginPath()
	ctx.arc(sword1X, sword1Y, swordRadius, 0, Math.PI*2)
	ctx.fillStyle = "#F70000"
	ctx.fill()
	ctx.closePath()
}

function detectCollision() {
	// if player1 collides with sword1
	if (player1X < sword1X + swordRadius &&
		player1X + playerWidth > sword1X - swordRadius &&
		player1Y < sword1Y + swordRadius &&
		player1Y + playerHeight > sword1Y - swordRadius) {
		// if player1 doesn't have sword and sword1 is grounded, pick up sword1
		if (!player1HasSword && sword1Grounded) {
			player1HasSword = true
			sword1Grounded = false
		}
	}
}

function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height)
	
	drawPlayer1()
	drawSword1()
	detectCollision()

	player1X += speed1X
	// flip direction when player1 reaches edge
	if (player1X + speed1X < 0 || player1X + speed1X > canvas.width-playerWidth) {
		speed1X = -speed1X
	}

	// player1 jumping code
	player1Y += speed1Y
	if (jumping1) {
		speed1Y += gravity
	}
	// when player1 reaches ground, stop jumping
	if (player1Y + speed1Y > canvas.height - playerHeight) {
		player1Y = canvas.height - playerHeight
		jumping1 = false
		speed1Y = 0
	}

	// if player1 has sword, make sword follow player1
	if (player1HasSword) {
		if (speed1X > 0) {
			sword1X = player1X
		} else {
			sword1X = player1X + playerWidth
		}
		sword1Y = player1Y
	} // if player1 doesn't have sword and sword is not grounded, then it is being thrown
	else if (!sword1Grounded) {
		sword1SpeedY += gravity
	}
	sword1X += sword1SpeedX
	sword1Y += sword1SpeedY
	// flip direction of sword1 when it gets to edge
	if (sword1X+sword1SpeedX < swordRadius || sword1X+sword1SpeedX > canvas.width-swordRadius) {
		sword1SpeedX = -sword1SpeedX
	}
	// if sword1 reaches the ground, stop its movement
	if (sword1Y+sword1SpeedY > canvas.height - swordRadius) {
		sword1Grounded = true
		sword1Y = canvas.height - swordRadius
		sword1SpeedX = 0
		sword1SpeedY = 0
	}

	requestAnimationFrame(draw)
}

draw()