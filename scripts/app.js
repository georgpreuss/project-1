function functionName() {

  // dimensions of grids
  const rows = 10
  const cols = 10

  // html element selectors
  const playerGrid = document.querySelector('#player')
  const computerGrid = document.querySelector('#computer')
  const startButton = document.querySelector('.commence')
  const playerTurn = document.querySelector('#turn')
  const vesselIcons = document.querySelectorAll('.vessel-icon')
  const showScore = document.querySelector('.score')
  const instructionsRead = document.querySelector('.instructions-read')
  const audio = document.querySelector('audio')

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

  // this html element selector needs to live here
  const playerGridArray = Array.from(playerGrid.children)

  // globally defined variables

  // temporarily store vessel name selected by player when placing vessel on grid
  let vesselSelected
  // temporarily store vessel length selected by player when placing vessel on grid
  let sizeOfVesselSelected
  // orientation 0 for horizontal and 1 for vertical
  let orientationPlayerVessel = 0
  // computerTorpedo function to start with array of all indices
  // this array will be reduced to not fire on the same cell more than once
  const cellsNotFiredUpon = Array.from(Array(100).keys())
  // keep track of player score
  let score = 0
  // keep track of computer score
  let computerScore = 0
  // variables to store randomly generated coordinates
  let randomX
  let randomY
  // randomly generated orientation (0 for horizontal or 1 for vertical) for placement of computer's vessels
  let orientation = 0
  // if computer hit successful go again
  let computerHit = 1
  // if player hit successful go again
  let playerHit = 1
  // keep track of turns
  let turn
  // store game state, 1 for on, 0 for off
  let gameState = 0
  // track cell index at mouse position
  let indexMousePosition

  // class for vessels
  class vessel {
    constructor(name, abb, size) {
      this.name = name,
      this.abb = abb,
      this.size = size
    }
  }
  // properties of vessels
  const carrier = new vessel('carrier', 'a', 5)
  const battleship = new vessel('battleship', 'b', 4)
  const cruiser = new vessel('cruiser', 'c', 3)
  const destroyer = new vessel('destroyer', 'd', 3)
  const submarine = new vessel('submarine', 's', 2)

  const armada = [carrier, battleship, cruiser, destroyer, submarine]

  // array to store position of computer's armada
  // 0 = water, a = aircraft carrier, b = battleship, c = cruiser, d = destroyer, s = submarine, x = sunk part, o = miss
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

  // array to store position of player's armada
  // 0 = water, a = aircraft carrier, b = battleship, c = cruiser, d = destroyer, s = submarine, x = sunk part, o = miss
  const playerBoard = [
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

  // function to randomly select starting coordinates for placement of vessels for given orientation and vessel length
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

  function plonkShip(vessel, orientation, randomY, randomX) {
    for (let i = 0; i < vessel.size; i++) {
      if (orientation === 0) {
        computerBoard[randomY][randomX + i] = vessel.abb
      } else {
        computerBoard[randomY + i][randomX] = vessel.abb
      }
    }
  }

  function deployFleet() {
    armada.forEach((vessel) => {
      let deployed = false
      while (deployed === false) {
        const anchorOut = anchor(vessel)
        if (checkSpace(vessel, anchorOut[0], anchorOut[1], anchorOut[2]) === 1) {
          plonkShip(vessel, anchorOut[0], anchorOut[1], anchorOut[2])
          deployed = true
        } else {
          deployed = false
        }
      }
    })
  }

  // player placement of vessels
  // on click of cell change corresponding values in playerBoard

  instructionsRead.addEventListener('click', () => {
    document.querySelector('.instructions').remove()
    document.querySelector('.scoreboard').style.display = 'flex'
    document.querySelector('.dashboard').style.display = 'flex'
  })

  startButton.addEventListener('click', () => {
    // if (gameState === 1) return
    // if not all player vessels placed return
    audio.src = 'sounds/battle-stations.mp3'
    audio.currentTime = 5
    audio.play()
    setTimeout(() => {
      audio.pause()
      audio.currentTime = 0
    },7500)
    startButton.style.display = 'none'
    document.querySelector('.show-score').style.display = 'inherit'
    deployFleet()
    gameState = 1
    // random generator to determine who starts: 0 for computer, 1 for player
    turn = Math.floor(Math.random() * 2)
    playerTurn.innerHTML = 'Flipping coin to determine who starts'
    turn === 0 ? playerTurn.innerHTML = 'Computer starts' : playerTurn.innerHTML = 'You start'
    while (turn === 0) {
      // playerTurn.innerHTML = 'Computer\'s turn'
      while (computerHit === 1) {
        computerTorpedo()
      }
    }
  })

  // if space bar key down set orientation to vertical
  document.addEventListener('keypress', (e) => {
    if (e.keyCode === 32) {
      // TODO maybe??? add a nice call to _ClearBoardOfAllHighlightsIDontWantToSeeAGain
      orientationPlayerVessel = orientationPlayerVessel === 0 ? 1 : 0
      // TODO = somehow re-highlight the board?
    }
  })

  vesselIcons.forEach((icon) => {
    if (gameState !== 1) {
      icon.addEventListener('click', () => {
        sizeOfVesselSelected = armada[icon.id].size
        vesselSelected = armada[icon.id]
      })
    }
  })

  // add eventListeners for each cell in player grid
  for (const div of playerGrid.children) {
    div.addEventListener('mouseover', (e) => {
      if (gameState === 1 || !sizeOfVesselSelected) return
      // grab the index of the cell mouse is over
      if (!validPosition(e.target.id, sizeOfVesselSelected, orientationPlayerVessel)) return
      indexMousePosition = Array.from(playerGrid.children).indexOf(e.target)
      // based on vessel selected highlight adjacent cells for length of vessel
      if (orientationPlayerVessel === 0) {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          playerGridArray[indexMousePosition + i].classList.toggle('vessel-hover')
        }
      } else {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          playerGridArray[indexMousePosition + (10 * i)].classList.toggle('vessel-hover')
        }
      }
    })

    div.addEventListener('mouseout', (e) => {
      if (gameState === 1) return
      indexMousePosition = Array.from(playerGrid.children).indexOf(e.target)
      if (orientationPlayerVessel === 0) {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          playerGridArray[indexMousePosition + i].classList.remove('vessel-hover')
        }
      } else {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          // TODO replace this with a nice call to _ClearBoardOfAllHighlightsIDontWantToSeeAGain
          playerGridArray[indexMousePosition + (10 * i)].classList.remove('vessel-hover')
        }
      }
    })

    div.addEventListener('click', (e) => {
      if (gameState === 1) return
      if (!validPosition(e.target.id, sizeOfVesselSelected, orientationPlayerVessel)) return
      indexMousePosition = Array.from(playerGrid.children).indexOf(e.target)
      plonkShipPlayer(vesselSelected, orientationPlayerVessel, indexMousePosition)
      checkVesselHealth()
      // refactor this!!
      if (uniqueChars['a'] === 5) {
        document.querySelector('.carrier-filled').style.width = '100%'
      }
      if (uniqueChars['b'] === 4) {
        document.querySelector('.battleship-filled').style.width = '100%'
      }
      if (uniqueChars['c'] === 3) {
        document.querySelector('.cruiser-filled').style.width = '100%'
      }
      if (uniqueChars['d'] === 3) {
        document.querySelector('.destroyer-filled').style.width = '100%'
      }
      if (uniqueChars['s'] === 2) {
        document.querySelector('.submarine-filled').style.width = '100%'
      }
      sizeOfVesselSelected = null
      vesselSelected = null
      // TODO : Refactor this into it's own function called _ClearBoardOfAllHighlightsIDontWantToSeeAGain
      document.querySelectorAll('.vessel-hover').forEach((elem) => elem.classList.remove('vessel-hover'))
    })
  }

  function plonkShipPlayer(vessel, orientation, index) {
    const getX = parseInt(playerGridArray[index].id[0])
    const getY = parseInt(playerGridArray[index].id[2])
    for (let i = 0; i < vessel.size; i++) {
      // if horizontal placement
      if (orientation === 0) {
        // replace values along x axis in playerBoard array with vessel.abb
        playerBoard[getY][getX + i] = vessel.abb
        playerGridArray[index + i].classList.add('vessel')
        // if vertical placement
      } else {
        // replace values along y axis in playerBoard array with vessel.abb
        playerBoard[getY + i][getX] = vessel.abb
        playerGridArray[index + (10 * i)].classList.add('vessel')
      }
    }
  }

  function validPosition(id, length, orientation) {
    if (orientation === 0) {
      return parseInt(id.split(',')[0]) + length > cols ? false : true
    } else {
      return parseInt(id.split(',')[1]) + length > rows ? false : true
    }
  }

  let uniqueChars
  function checkVesselHealth() {
    uniqueChars = {}
    const playerBoardAsString = playerBoard.join('')
    playerBoardAsString.replace(/\S/g, function(l){uniqueChars[l] = (isNaN(uniqueChars[l]) ? 1 : uniqueChars[l] + 1)})
    return uniqueChars
  }

  function whoWins() {
    if (score === 170 && computerScore < 170) {
      // player wins
      playerTurn.innerHTML = 'You win!'
      gameState = 0
    } else if (score < 170 && computerScore === 170) {
      // computer wins
      playerTurn.innerHTML = 'Computer wins!'
    } else {
      // game not finished yet
      console.log('keep playing')
    }
  }

  for (const div of computerGrid.children) {
    div.addEventListener('mouseover', (e) => {
      // why can't I have this condition outside for all three cases?
      if (gameState === 0) return
      e.target.classList.toggle('vessel')
    })
    div.addEventListener('mouseout', (e) => {
      if (gameState === 0) return
      e.target.classList.toggle('vessel')
    })
    div.addEventListener('click', (e) => {
      if (gameState === 0) return
      playerTorpedo(e)
    })
  }

  function playerTorpedo(e) {
    // if cell clicked extract coordinates
    const checkX = e.target.id.split('')[1]
    const checkY = e.target.id.split('')[3]
    // if cell already clicked return
    if (document.getElementById(`c${checkX},${checkY}`).classList.contains('hit')) return
    // check value of cell clicked
    if (computerBoard[checkY][checkX] === 0) {
      // if cell value is 0 add class miss
      document.getElementById(`c${checkX},${checkY}`).classList.add('miss')
      playerHit = 0
      turn = 0
      audio.src = 'sounds/ship-miss.mp3'
      audio.play()
      while (turn === 0) {
        playerTurn.innerHTML = 'Your turn'
        computerTorpedo()
      }
    } else {
      // if cell value is !0 add class hit
      document.getElementById(`c${checkX},${checkY}`).classList.add('hit')
      score += 10
      showScore.innerHTML = score
      playerHit = 1
      audio.src = 'sounds/ship-part-explosion.mp3'
      audio.play()
      whoWins()
    } return playerHit
  }

  function computerTorpedo() {
    // pick one at random and fire
    const cellBeingFiredUpon = cellsNotFiredUpon[Math.floor(Math.random() * cellsNotFiredUpon.length)]
    // if class === vessel register as hit
    if (playerGridArray[cellBeingFiredUpon].classList.contains('vessel')) {
      playerGridArray[cellBeingFiredUpon].classList.add('hit')
      // if hit, then remove that index from array

      const getX = playerGridArray[cellBeingFiredUpon].id[0]
      const getY = playerGridArray[cellBeingFiredUpon].id[2]
      playerBoard[getY][getX] = 'x'
      const lastHitLocation = cellsNotFiredUpon.indexOf(cellBeingFiredUpon)
      cellsNotFiredUpon.splice(lastHitLocation, 1)
      // if hit vessel set hit to 1
      computerScore += 10
      computerHit = 1
      turn = 0
      whoWins()
      // add below for more AI
      // while (computerHit === 1) {
      laserGuidance(cellBeingFiredUpon)
      // }
      checkVesselHealth()
      // refactor this!

      let widthPercentA
      let widthPercentB
      let widthPercentC
      let widthPercentD
      let widthPercentS
      if (!uniqueChars['a']) {
        widthPercentA = 0
      } else {
        widthPercentA = uniqueChars['a'] / 5 * 100
      }
      document.querySelector('.carrier-filled').style.width = `${widthPercentA}%`
      if (!uniqueChars['b']) {
        widthPercentB = 0
      } else {
        widthPercentB = uniqueChars['b'] / 4 * 100
      }
      document.querySelector('.battleship-filled').style.width = `${widthPercentB}%`
      if (!uniqueChars['c']) {
        widthPercentC = 0
      } else {
        widthPercentC = uniqueChars['c'] / 3 * 100
      }
      document.querySelector('.cruiser-filled').style.width = `${widthPercentC}%`
      if (!uniqueChars['d']) {
        widthPercentD = 0
      } else {
        widthPercentD = uniqueChars['d'] / 3 * 100
      }
      document.querySelector('.destroyer-filled').style.width = `${widthPercentD}%`
      if (!uniqueChars['s']) {
        widthPercentS = 0
      } else {
        widthPercentS = uniqueChars['s'] / 2 * 100
      }
      document.querySelector('.submarine-filled').style.width = `${widthPercentS}%`
    } else {
      // change cell class to miss
      playerGridArray[cellBeingFiredUpon].classList.add('miss')
      // remove number from array
      cellsNotFiredUpon.splice(cellsNotFiredUpon.indexOf(cellBeingFiredUpon), 1)
      // if hit unsuccessful set hit to 0
      computerHit = 0
      turn = 1
    }
    return computerHit, turn
  }

  function laserGuidance(lastHitLocation) {
    // generate random number between 1 and 4 for all directions
    // const tryAdjacent = Math.floor(Math.random() * 4)
    const tryAdjacent = 0
    const cellAbove = !cellsNotFiredUpon.includes(lastHitLocation - cols)
    const cellRight = !cellsNotFiredUpon.includes(lastHitLocation + 1)
    const cellBelow = !cellsNotFiredUpon.includes(lastHitLocation + cols)
    const cellLeft = !cellsNotFiredUpon.includes(lastHitLocation - 1)
    // console.log('torpedo just hit boat on ', lastHitLocation, 'coordinates are ', playerGridArray[lastHitLocation].id)
    // console.log('cells not fired upon include ', cellsNotFiredUpon)
    // console.log('direction (0 above, 1 right, 2 below, 3 left) is ', tryAdjacent)
    // console.log('cellAbove fired upon ', cellAbove, 'cellRight fired upon ', cellRight, 'cellBelow fired upon ', cellBelow, 'cellLeft fired upon ', cellLeft)

    switch (tryAdjacent) {
      case 0: !cellAbove ? console.log(playerGridArray[lastHitLocation - cols]) : console.log('don\'t fire above'); break
      case 1: !cellRight ? console.log('fire right') : console.log('don\'t fire right'); break
      case 2: !cellBelow ? console.log('fire below') : console.log('don\'t fire below'); break
      case 3: !cellLeft ? console.log('fire left') : console.log('don\'t fire left'); break
    }
    // if (cellRight) {
    //   // fire on right
    //   // if hit keep firing on that axis until miss // if vessel not sunk go to other end
    // }
    // }

    function guideMissile(possibleTarget) {
      if (possibleTarget.classList.contains('vessel')) {
        playerGridArray[cellBeingFiredUpon].classList.add('hit')
      }
    }
  }


}

document.addEventListener('DOMContentLoaded', functionName)