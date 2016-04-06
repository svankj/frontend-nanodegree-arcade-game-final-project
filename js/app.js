"use strict";

var Y1_LOC_ROW = 55;
var Y2_LOC_ROW = 140;
var Y3_LOC_ROW = 220;
var Y_POS = [Y1_LOC_ROW, Y2_LOC_ROW, Y3_LOC_ROW];
var X_POS = [0, 100, 200, 300, 400];
var POWER_LEVEL = 50;
var TOTAL_NUM_LIVES = 3;
var DAMAGE = [5, 10, 15];
var START_X_PLAYER = 200;
var START_Y_PLAYER = 330;
var START_X_ENEMY = -100;
var STATUS = {0: 'GAME', 1: 'START GAME', 2: 'GAME OVER', 3: 'NEXTLEVEL', 4: 'WIN', 5: 'RESTART'};
var enemiesFirstLevel = ['images/enemy-bug.png', 'images/enemy-bullet.png',
						'images/enemy-ghost.png', 'images/enemy-nabbit.png'];
var enemiesSecondLevel = ['images/enemy-goblin.png', 'images/enemy-larry.png',
						'images/enemy-loom.png', 'images/enemy-mario.png'];
var enemiesThirdLevel = ['images/enemy-maniac.png', 'images/enemy-monkey.png',
						'images/enemy-rose.png', 'images/enemy-silent.png'];
var players = ['images/char-boy.png', 'images/char-cat-girl.png',
				'images/char-horn-girl.png', 'images/char-pink-girl.png',
				'images/char-princess-girl.png'];
var rect = [ {x1: 10, x2: 80, y1: 455, y2: 540},
    		   {x1: 110, x2: 180, y1: 455, y2: 540},
    		   {x1: 210, x2: 280, y1: 455, y2: 540},
    		   {x1: 310, x2: 380, y1: 455, y2: 540},
    		   {x1: 410, x2: 480, y1: 450, y2: 540}];
var bonus_value = {'images/GemBlue.png': 1,
					 'images/GemGreen.png': 1,
					 'images/GemOrange.png': -1,
					 'images/Key.png': 5,
					 'images/Rock.png': -10,
					 'images/Star.png': 10
					};
var bonus_sprite = [[],['images/GemBlue.png', 'images/GemGreen.png', 'images/GemOrange.png'],
			   ['images/Key.png', 'images/Rock.png', 'images/Star.png']];
var LEVELS = {ONE: 0, TWO: 1, THREE: 2};
var level = LEVELS.ONE;
var GAME_STATUS = STATUS['1'];
var PLAYER_SELECTED = -1;
var allEnemies = [];
var allBonuses = [];
var OFFSET_X_1 = 3;
var OFFSET_X_2 = 15;
var OFFSET_X_3 = 15;
var SCORE=0;

// Enemies our player must avoid
// Paramter: x, y coordinates; v velocity
var Enemy = function(x, y, v, sprite, collision_box) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.v = v;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
    // Box for collision detection
    this.collision_box = collision_box;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// First Level Enemy
var EnemyFirstLevel = function (row) {
	this.row = row;
	var _x = START_X_ENEMY; // Start x position
	var _y = (this.row%3 === 0)?Y1_LOC_ROW:((this.row%3 === 1)?Y2_LOC_ROW:Y3_LOC_ROW); // Choose row of enemy
    Enemy.call(this, _x, _y,
    	10*getRandomNum(5, 50), // Random velocity of enemy
    	enemiesFirstLevel[getRandomNum(0, 3)], // Random image of enemy
    	{x: _x+OFFSET_X_1, y: _y+80, width: 95, height: 70} // Collision box
    );
	// Damage of first level enemy
	this.damage = DAMAGE[0];
};

EnemyFirstLevel.prototype = Object.create(Enemy.prototype);
EnemyFirstLevel.prototype.constructor = EnemyFirstLevel;
EnemyFirstLevel.prototype.update = function(dt){
	// Till enemy x position < window width
	if(this.x<WIN_WIDTH) {
		var x0 = this.v*dt;
		this.x += x0;
		// Update collision box
    	this.collision_box.x += x0;
	} else {
		// After enemy is out screen reset x,
		// velocity and sprite image, it doesn't
		// create a new enemy just reset the one
		// out of screen
		this.x = 0;
		this.v = 1000*dt*getRandomNum(5, 50);
		this.sprite = enemiesFirstLevel[getRandomNum(0, 3)];
		// Update collision box
    	this.collision_box.x = OFFSET_X_1;
	}
};

// Second Level Enemy
var EnemySecondLevel = function (row) {
	this.row = row;
	var _x = START_X_ENEMY; // Start x position
	var _y = (this.row%3 === 0)?Y1_LOC_ROW:((this.row%3 === 1)?Y2_LOC_ROW:Y3_LOC_ROW); // Choose row of enemy
    Enemy.call(this,  _x, _y,
    	10*getRandomNum(5, 50), // Random velocity of enemy
    	enemiesSecondLevel[getRandomNum(0, 3)], // Random image of enemy
    	{x: _x+OFFSET_X_2, y: _y+80, width: 80, height: 70} // Collision box
    );
	// Damage of second level enemy
	this.damage = DAMAGE[1];
};

EnemySecondLevel.prototype = Object.create(Enemy.prototype);
EnemySecondLevel.prototype.constructor = EnemySecondLevel;
EnemySecondLevel.prototype.update = function(dt){
	// Till enemy x position < window width
	if(this.x<WIN_WIDTH) {
		var x0 = this.v*dt;
		this.x += x0;
		// Update collision box
    	this.collision_box.x += x0;
	} else {
		// After enemy is out screen reset x,
		// velocity and sprite image, it doesn't
		// create a new enemy just reset the one
		// out of screen
		this.x = 0;
		this.v = 1000*dt*getRandomNum(5, 50);
		this.sprite = enemiesSecondLevel[getRandomNum(0, 3)];
		// Update collision box
    	this.collision_box.x = OFFSET_X_2;
	}
};

// Third Level Enemy
var EnemyThirdLevel = function (row) {
	this.row = row;
	var _x = START_X_ENEMY; // Start x position
	var _y = (this.row%3 === 0)?Y1_LOC_ROW:((this.row%3 === 1)?Y2_LOC_ROW:Y3_LOC_ROW); // Choose row of enemy
    Enemy.call(this, _x, _y,
    	10*getRandomNum(5, 50), // Random velocity of enemy
    	enemiesThirdLevel[getRandomNum(0, 3)], // Random image of enemy
    	{x: _x+OFFSET_X_3, y: _y+80, width: 80, height: 75} // Collision box
    );
	// Damage of third level enemy
	this.damage = DAMAGE[2];
};

EnemyThirdLevel.prototype = Object.create(Enemy.prototype);
EnemyThirdLevel.prototype.constructor = EnemyThirdLevel;
EnemyThirdLevel.prototype.update = function(dt){
	// Till enemy x position < window width
	if(this.x<WIN_WIDTH) {
		var x0 = this.v*dt;
		this.x += x0;
		// Update collision box
    	this.collision_box.x += x0;
    } else {
		// After enemy is out screen reset x,
		// velocity and sprite image, it doesn't
		// create a new enemy just reset the one
		// out of screen
		this.x = 0;
		this.v = 1000*dt*getRandomNum(5, 50);
		this.sprite = enemiesThirdLevel[getRandomNum(0, 3)];
		// Update collision box
    	this.collision_box.x = OFFSET_X_3;
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Generate random number between [min, max]
// Parameter: min and max value
function getRandomNum(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

// Class of Bonus
// Parameter: sprite
var Bonus = function(sprite) {
    this.x = X_POS[getRandomNum(0, 4)]; // X position
    this.y = Y_POS[getRandomNum(0, 2)]; // Y position
    // Random choose of sprite
    this.sprite = (sprite.length!==0)?sprite[getRandomNum(0, 2)]:0;
    // Bonus points based on the sprite
    this.value = bonus_value[this.sprite];
    // Box for collision detection
    this.collision_box = {x: this.x+10, y: this.y+70, width: 80, height: 80};
};

// Update the bonus's position, required method for game
Bonus.prototype.update = function() {
	// No changing position for Bonus
};

// Draw the player on the screen, required method for game
Bonus.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Level object
var level_obj = [
		{enemy: EnemyFirstLevel, NumBonuses:0, NumEnemies:3},
		{enemy: EnemySecondLevel,NumBonuses:1, NumEnemies:6},
		{enemy: EnemyThirdLevel, NumBonuses:2, NumEnemies:9}];

// Generate bonuses every time is required, that is the case when
// number of bonuses is less than the level required
setInterval(function() {
	if(allBonuses.length < level_obj[level].NumBonuses) {
		allBonuses.push(new Bonus(bonus_sprite[level]));
	}
}, 3000);

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Class of Player
var Player = function() {
    this.x = START_X_PLAYER; // Start X position
    this.y = START_Y_PLAYER; // Start Y position
    this.sprite = players[0];
    // Power level increase with bonus, decrease with collisions and bad bonus
    this.power = POWER_LEVEL;
    // Number of lives
    this.lives = TOTAL_NUM_LIVES;
    // Box for collision detection
    this.collision_box = {x: this.x+15, y: this.y+60, width: 75, height: 80};
};

// Update the player's position, required method for game
Player.prototype.update = function() {
	// GAME OVER CASE
	if(this.lives===0 && this.power===POWER_LEVEL)
		GAME_STATUS=STATUS['2'];
};

// Change player and box collision position based on keyboard events
// Parameter: direction, direction player keys
Player.prototype.handleInput = function(direction) {
	switch(direction) {
	    case 'left':
	    	var tot = (this.x>0)?100:0;
	    	this.x-=tot;
	    	this.collision_box.x-=tot;
	        break;
	    case 'up':
	    	tot = (this.y-100>0)?100:((this.y>0)?this.y:0);
			this.y-=tot;
			this.collision_box.y-=tot;
	    	// Test for next level
	    	if(this.y<=0 && GAME_STATUS!==STATUS['3']) {
	    		switch(level) {
	    			case LEVELS.ONE:
	    				level=LEVELS.TWO;
	    				GAME_STATUS=STATUS['3'];
	    				break;
	    			case LEVELS.TWO:
	    				level=LEVELS.THREE;
	    				GAME_STATUS=STATUS['3'];
	    				break;
	    			case LEVELS.THREE:
	    				SCORE=0;
	    				for(var i=0; i<this.lives; i++)
	         				SCORE+=(i===0)?this.power:POWER_LEVEL;
	    				GAME_STATUS=STATUS['4'];
	    				break;
	    			default:
	    				break;
	    		}
	    	}
	        break;
	    case 'right':
	    	tot = (this.x<(WIN_WIDTH-105))?100:0;
			this.x+=tot;
			this.collision_box.x+=tot;
	        break;
	    case 'down':
	    	tot = (this.y<(WIN_HEIGHT-216))?100:0;
			this.y+=tot;
			this.collision_box.y+=tot;
	        break;
	    case 'enter':
	    	// Restart game when pressed enter
	    	if(GAME_STATUS===STATUS['2'] || GAME_STATUS===STATUS['4'])
	    		GAME_STATUS=STATUS['5'];
	        break;
	    default:
	    	break;
	}
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // Power level
    writeText(this.power, 30, 85, "30px Comic Sans MS");
    // Number of lives
    for(var i=0; i<this.lives; i++)
		ctx.drawImage(Resources.get('images/Heart.png'), 400+(i*25), 52);
	//ctx.strokeRect(this.collision_box.x,this.collision_box.y,this.collision_box.width,this.collision_box.height);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Generate enemies every time is required, that is the case when
// number of enemies is less than the level required
setInterval(function() {
	if(allEnemies.length < level_obj[level].NumEnemies) {
		allEnemies.push(new level_obj[level].enemy(allEnemies.length));
	}
}, 200);
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// Add enter key to restart game when is over
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
	player.handleInput(allowedKeys[e.keyCode]);
});

// This listens for mouse click to select a player
document.addEventListener('mousedown', function(e) {
	var point = {x: e.offsetX, y: e.offsetY};
	if(GAME_STATUS===STATUS['1'])
		PLAYER_SELECTED = intersection(point, rect);
});

// This check if there is intersection between a point and rectangle
// Parameter: p point, r rectangle
function intersection(p, r) {
	var index = -1;
	for(var i=0; i<r.length; i++)
    	if(p.x > r[i].x1 && p.x < r[i].x2 && p.y > r[i].y1 && p.y < r[i].y2)
    		index=i;
    return index;
}

// This write text in given position with a type of font
// Parameter: text to show, coordinates x and y, font
function writeText(text, x, y, font) {
	ctx.font = font;
	ctx.textAlign = "center";
	// Create gradient
	var gradient = ctx.createLinearGradient(0, 0, WIN_WIDTH, 0);
	gradient.addColorStop("0", "magenta");
	gradient.addColorStop("0.5", "blue");
	gradient.addColorStop("1.0", "red");
	// Fill with gradient
	ctx.fillStyle = gradient;
	ctx.fillText(text, x, y);
}