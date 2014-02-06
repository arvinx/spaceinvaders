Group:
Arvin Rezvanpour - 999025692
Ammar Javed - 999058273



How it works:

- there is only one Tank and a single Laser at any time.
- the invader objects are stored in a 2D array [row][col] and hit property is set to true when ever they are hit so they are not rendered anymore
- at any point in time there are at most 4 functions drawing onto the canvas (the four being drawLaser, draw, moveTankRight, moveTankLeft)
- draw() handles logic for invaders moving around, but also redraws the laser and tank in since draw() clears canvas each time.
- key events trigger functions to move the Tank and to fire the Laser.
- initializeGame() starts the game at a set level and is triggered from the menu
by the user pressed specified keys.
- initializeMenu() clears the canvas and draws the menu.
- keySetup(menu) remaps the event handlers depending on whether you are on the menu or in the game.


List of Datastructures:

- the Tank (defender/cannon)
- Invaders
- 2D array of invaders[row][col]
- Laser are all objects we have defined.
