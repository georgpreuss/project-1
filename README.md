### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive

# Operation Steel Sabre

## Overview
Operation Steel Sabre is an entertaining browser-based guessing game. It is very much like the original paper-based game, only here you play against a computer trying to sink the computer player's fleet before it sinks yours.

This was my first project from General Assembly's Software Engineering Immersive Course. It was an **individual** project built in **one week**, and was both the first proper game I had built, and my first real-world type practice with JavaScript.

You can launch the game on GitHub pages [here](https://georgpreuss.github.io/project-1/), or find the GitHub repo [here](https://github.com/georgpreuss/project-1/).

## Brief

- **Render a game in the browser**
- **Design logic for winning & visually display which player won**
- **Include separate HTML / CSS / JavaScript files**
- Stick with **KISS (Keep It Simple Stupid)** and **DRY (Don't Repeat Yourself)** principles
- Use **Javascript** for **DOM manipulation**
- **Deploy your game online**, where the rest of the world can access it
- Use **semantic markup** for HTML and CSS (adhere to best practices)

## Technologies used

- HTML
- CSS
- JavaScript (ES6)
- Git and GitHub
- Photoshop
- Google Fonts

## Approach
### Board layout
- I decided to create a 2D rather than a 1D grid using a nested for loop:

	```
 // create html elements with xy coordinates for each of the gameboards
  for (let y = 0; y < cols; y++) {
    	for (let x = 0; x < rows; x++) {

      		// create a new div for each grid cell
      		const computerCell = document.createElement('div')
      		computerGrid.appendChild(computerCell)
      		const playerCell = document.createElement('div')
      		playerGrid.appendChild(playerCell)

      		// give each div element a coordinate
      		computerCell.id = 'c' + x + ',' + y
      		playerCell.id = x + ',' + y
    	}
  }
  	
- This made life a lot easier when it came to creating the randomised vessel placement and computer torpedo functions as I could then base these on an xy coordinate system

### Keeping track of cell state
- I designed the game in such a way that each cell can take one of  8 states:
	- 0 = water, a = aircraft carrier, b = battleship, c = cruiser, d = destroyer, s = submarine, x = sunk part, o = miss
	- the state of each cell is stored in an array of arrays and is initialised as follows:

	```
	const computerBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]
  
### Vessel placement (computer player)
- To prevent vessels from overlapping or going out of bounds I wrote an `anchor` function that first randomly selects an orientation (horizontal or vertical) and then a coordinate for a vessel's 'anchor'. The anchor is always going to be the leftmost or topmost part of a vessel. It takes the vessel as an argument to ensure that the anchors it provides can only be valid ones, i.e. vessels can't go off the grid:

	```
function anchor(vessel) {
    // generate random number for orientation - 0 for horizontal, 1 for vertical
    orientation = Math.floor(Math.random() * 2)
    if (orientation === 0) {
      // if horizontal, limit x coordinates to cols + 1 - vessel length
      randomY = Math.floor(Math.random() * rows)
      randomX = Math.floor(Math.random() * (cols + 1 - vessel.size))
    } else {
      // if vertical, limit y coordinates to rows + 1 - vessel length
      randomY = Math.floor(Math.random() * (rows + 1 - vessel.size))
      randomX = Math.floor(Math.random() * cols)
    }
    return [orientation, randomY, randomX]
  }
  
  
  
- A `checkSpace` function then makes sure that there is enough space for a proposed anchor and given vessel length, so it can't overlap with another vessel:

	```
// take random anchor and check adjacent cells for space
  function checkSpace(vessel, orientation, randomY, randomX) {
    if (orientation === 0) {
      for (let i = 0; i < vessel.size; i++) {
        const cellState = computerBoard[randomY][randomX + i]
        // if any cell is occupied return 0
        if (cellState !== 0) {
          return 0
        }
      }
    } else if (orientation === 1) {
      for (let i = 0; i < vessel.size; i++) {
        const cellState = computerBoard[randomY + i][randomX]
        // if any cell is occupied return 0
        if (cellState !== 0) {
          return 0
        }
      }
    }
    return 1
  }

- Finally, when all checks are passed successfully the `plonkShip` function notes down the type and location of each vessel on the grid:

	```
  function plonkShip(vessel, orientation, randomY, randomX) {
    for (let i = 0; i < vessel.size; i++) {
      if (orientation === 0) {
        computerBoard[randomY][randomX + i] = vessel.abb
      } else {
        computerBoard[randomY + i][randomX] = vessel.abb
      }
    }
  }

- all these functions are called in a `deployFleet` function which runs once at the start of each game until all vessels are placed

### Vessel placement (human player)
- Like with the computerBoard, the state of each cell is tracked in an array of arrays (humanBoard)
- The user first clicks the green outline of a vessel type to select it
- Pressing the spacebar will change the orientation and hovering over the board with the cursor will show you where the vessel will be placed upon click
- In order to prevent the user from placing vessels across multiple rows or columns I added a `validPosition` function which gets called every time a cell is clicked:

	```
 function validPosition(id, length, orientation) {
    if (orientation === 0) {
      return parseInt(id.split(',')[0]) + length > cols ? false : true
    } else {
      return parseInt(id.split(',')[1]) + length > rows ? false : true
    }
  }

- it takes as arguments the id of the html cell, which contains coordinate information, and the length of the currently selected vessel as well as the orientation
- during board set up an event listener calls this function on each click and only proceeds with placing a vessel if `validPosition` returns true
- when a vessel is placed the CSS of the corresponding cells change and the correspondong values in the humanBoard get updated, e.g. 5 instances of 0 would get updated to 'a'

### Torpedo function (computer player)
- The computer player currently isn't very smart and only selects a target at random
- However, to ensure it doesn't fire on the same cell more than once I have added some logic:
	- Before each 'torpedo launch', the computer refers to an array containing the index positions of all the cells that haven't been fired upon yet (`cellsNotFiredUpon`)
	- `cellsNotFiredUpon` is continuously updated each time the torpedo either hits or misses (the indices of the cells that have been fired upon are removed from the array)

### Torpedo function (human player)
- The code for the human player's torpedo is much simpler
- Upon each click of a cell, the program refers to the humanBoard: if the cell contains a vessel it will register as a hit, otherwise as a miss

### Variables
- Some of the variables I used in this game include:
	- `gameState` toggles the event listeners needed to place vessels at the start of the game as well as the cell highlighting when one hovers over the board
	- `computerHit` / `playerHit` check if the last torpedo fired hit a vessel, otherwise the turn ends
	- `turn` keeps track of whose turn it is
	- `score` and `computerScore` keep track of the players' scores as the name suggests
	
	
## Screenshots
Coming soon

## Bugs
- Unfortunately, there are still a few bugs that I didn't address yet, the biggest one beeing the sub-optimal turn-based game behaviour: I didn't add the necessary timers to delay the computer player's torpedo firing
- There is also a bug when you change the orientation by pressing the space bar before placing vessels: cell highlighting doesn't update properly when at the time of pressing the space bar you are hovering over the board


## Potential future features
- A scoreboard
- Mobile compatibility
- More intuitive vessel placement
- Overhauling the computer torpedo logic and replacing it with a probabilistic approach, e.g. assigning all remaining cells 1/N probability and reducing N to max 4 when the last torpedo hit successfully
- A smarter computer torpedo algorithm:
	- initially I had thought of ways to make the computer smarter by targeting cells adjacent to recent hits, but ran out of time


## Lessons learned
- I changed my mind multiple times throughout the project, changing designs or logic approaches which cost me valuable time. In future, I will spend more time planning out the design and hopefully also benefit from more experience
- Don't forget about KISS: creating the vessel health images was quite a complicated and time consuming task layering multiple transparent images