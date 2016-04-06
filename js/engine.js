"use strict";

/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        WIN_WIDTH = 505,
		WIN_HEIGHT = 606,
        lastTime;
    	canvas.width = WIN_WIDTH;
    	canvas.height = WIN_HEIGHT;
    	doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisionsEnemies(); // Check collision between enemies and player
        checkCollisionsBonuses(); // Check collision between bonuses and player
    }

	/* This is called by the update function and loops through all of the
     * objects within your allEnemies array to check for collision with
     * the player. In case it will update position, lives and power of player.
     */
     function checkCollisionsEnemies() {
     	allEnemies.forEach(function(enemy) {
			if(intersectRectangle(player.collision_box, enemy.collision_box)) {
	    		if(player.power-enemy.damage<=0 && player.lives>0) {
	    			player.power=POWER_LEVEL;
	    			--player.lives;
	    		} else if(player.lives>0) {
	    			player.power-=enemy.damage;
	    		} else {
	    			--player.lives;
	    		}
	    		player.x=START_X_PLAYER;
	    		player.y=START_Y_PLAYER;
				player.collision_box.x=START_X_PLAYER+10;
				player.collision_box.y=START_Y_PLAYER+60;
			}
		});
     }

	/* This is called by the update function and loops through all of the
     * objects within your allBonuses array to check for collision with
     * the player. In case it will update position, lives and power of player
     * and it will remove the bonus.
     */
     function checkCollisionsBonuses() {
     	allBonuses.forEach(function(bonus) {
			if(intersectRectangle(player.collision_box, bonus.collision_box)) {
				allBonuses = allBonuses.filter(item => item !== bonus);
				if(bonus.value<0) {
					if(player.power+bonus.value<=0 && player.lives>0) {
	    				player.power=POWER_LEVEL;
	    				--player.lives;
	    			} else if(player.lives>0) {
	    				player.power+=bonus.value;
	    			} else {
	    				--player.lives;
	    			}
				} else {
					if(player.power+bonus.value>POWER_LEVEL && player.lives<TOTAL_NUM_LIVES) {
						player.power=(player.power+bonus.value)-POWER_LEVEL;
						++player.lives;
					} else if(player.power+bonus.value<=POWER_LEVEL) {
						player.power+=bonus.value;
					}
				}
			}
		});
     }

     /* This is called by checkCollisionsEnemies() and checkCollisionsBonuses()
      * to look for collisions/intersections between rectangles.
     */
     function intersectRectangle(rectA, rectB) {
     	if (rectA.x < rectB.x + rectB.width  &&
			rectA.x + rectA.width  > rectB.x &&
			rectA.y < rectB.y + rectB.height &&
			rectA.y + rectA.height > rectB.y)
			return true;
		return false;
     }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
    	switch(GAME_STATUS) {
    		// GAME STATUS
    		case STATUS['0']:
    		    /* Loop through all of the objects within the allEnemies
    		    * and allBonuses array and call
         		* the render function you have defined.
         		*/
         		allBonuses.forEach(function(bonus) {
	        		bonus.render();
	        	});
		        allEnemies.forEach(function(enemy) {
		            enemy.render();
		        });
	        	player.render();
    			break;
    		// START STATUS
		    case STATUS['1']:
		    	reset();
		        break;
		    // GAME OVER STATUS
		    case STATUS['2']:
	         	writeText(GAME_STATUS, WIN_WIDTH/2, 270, "50px Comic Sans MS");
	         	writeText("PRESS ENTER", WIN_WIDTH/2, 360, "50px Comic Sans MS");
				var interval = setInterval(function() {
				    if(GAME_STATUS===STATUS['5']) {
					    clearInterval(interval);
					    init();
				    }
				}, 1);
		        break;
		    // NEXT LEVEL STATUS
		    case STATUS['3']:
		    	// Select the right level
		    	var i=level+1;
	         	writeText("LEVEL "+i, WIN_WIDTH/2, 270, "50px Comic Sans MS");
	         	writeText("wait... ", WIN_WIDTH/2, 340, "50px Comic Sans MS");
				setTimeout(function() {
					GAME_STATUS=STATUS['0'];
					reset();
				}, 500);
		        break;
		    // WIN STATUS
		    case STATUS['4']:
	         	writeText("YOU "+GAME_STATUS+"!", WIN_WIDTH/2, 270, "50px Comic Sans MS");
		        writeText("YOUR SCORE: "+SCORE, WIN_WIDTH/2, 310, "30px Comic Sans MS");
		        writeText("PRESS ENTER", WIN_WIDTH/2, 360, "50px Comic Sans MS");
				interval = setInterval(function() {
				    if(GAME_STATUS===STATUS['5']) {
					    clearInterval(interval);
					    init();
				    }
				}, 1);
		        break;
		    default:
		    	break;
		}
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */

     /* This function is called to handle the case when game is
      * in RESTART, START or GAME STATUS.
      */
    function reset() {
    	switch(GAME_STATUS) {
	    	// RESTART STATUS
	    	case STATUS['5']:
	    		PLAYER_SELECTED=-1;
	    		GAME_STATUS=STATUS['1'];
    			player.x = START_X_PLAYER;
    			player.y = START_Y_PLAYER;
    			player.collision_box.x=START_X_PLAYER+10;
				player.collision_box.y=START_Y_PLAYER+60;
	    	// START STATUS
			case STATUS['1']:
				allEnemies = [];
				allBonuses = [];
		    	player.lives=TOTAL_NUM_LIVES;
		    	player.power=POWER_LEVEL;
		    	level = LEVELS.ONE;
			    writeText(GAME_STATUS, WIN_WIDTH/2, 270, "50px Comic Sans MS");
			    writeText("LEVEL 1", WIN_WIDTH/2, 360, "50px Comic Sans MS");
			    for(var i=0; i<players.length; i++)
			    	ctx.drawImage(Resources.get(players[i]), i*100, 400);
			    if(PLAYER_SELECTED!==-1) {
			    	GAME_STATUS=STATUS['0'];
			    	player.sprite=players[PLAYER_SELECTED];
			    }
			    break;
	    	// GAME STATUS
			case STATUS['0']:
				allEnemies = [];
				allBonuses = [];
    			player.x = START_X_PLAYER;
    			player.y = START_Y_PLAYER;
    			player.collision_box.x=START_X_PLAYER+10;
				player.collision_box.y=START_Y_PLAYER+60;
				break;
			default:
			   	break;
		}
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/enemy-ghost.png',
        'images/enemy-goblin.png',
        'images/enemy-larry.png',
        'images/enemy-loom.png',
        'images/enemy-maniac.png',
        'images/enemy-mario.png',
        'images/enemy-monkey.png',
        'images/enemy-nabbit.png',
        'images/enemy-rose.png',
        'images/enemy-silent.png',
        'images/enemy-bullet.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Heart.png',
        'images/GemBlue.png',
        'images/GemGreen.png',
        'images/GemOrange.png',
        'images/Key.png',
        'images/Rock.png',
        'images/Star.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.WIN_WIDTH = WIN_WIDTH;
	global.WIN_HEIGHT = WIN_HEIGHT;
})(this);
