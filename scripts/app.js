function functionName() {

  // dimensions of grids
  const rows = 10
  const cols = 10

  // html element selectors
  const playerGrid = document.querySelector('#player')
  const computerGrid = document.querySelector('#computer')
  const startButton = document.querySelector('.commence')
  const playerTurn = document.querySelector('#turn')
  const vesselButtons = document.querySelector('.player-info').children
  const showScore = document.querySelector('.score')

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

      // give each div visible coordinates for testing
      // computerCell.innerHTML = x + ',' + y
      // playerCell.innerHTML = x + ',' + y
    }
  }

  const playerGridArray = Array.from(playerGrid.children)
  // temporarily store vessel name selected by player when placing vessel on grid
  let vesselSelected
  // temporarily store vessel length selected by player when placing vessel on grid
  let sizeOfVesselSelected
  // orientation 0 for horizontal and 1 for vertical
  let orientationPlayerVessel = 0
  // computerTorpedo function to start with array of all indices
  // this array will be reduced to not fire on the same cell more than once
  let cellsNotFiredUpon = Array.from(Array(100).keys())
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
    console.log(computerBoard)
    console.log(computerBoard.join(','))

  }

  // player placement of vessels
  // on click of cell change corresponding values in playerBoard

  let indexMousePosition

  startButton.addEventListener('click', () => {
    // remove event listeners for playerBoard!
    // for (const div of playerGrid.children) {
    //   div.removeEventListener('mouseover', false)
    //   div.removeEventListener('mouseout', false)
    //   div.removeEventListener('click', false)
    // }
    deployFleet()
    // random generator to determine who starts: 0 for computer, 1 for player
    turn = Math.floor(Math.random() * 2)
    playerTurn.innerHTML = 'Flipping coin to determine who starts'
    // setTimeout(playerTurn.innerHTML = 'Flipping coin to determine who starts', 5000)
    turn === 0 ? playerTurn.innerHTML = 'Computer starts' : playerTurn.innerHTML = 'You start'
    while (turn === 0) {
      // playerTurn.innerHTML = 'Computer\'s turn'
      while (computerHit === 1) {
        computerTorpedo()
      }
    }
  })

  // if space bar key down set orientation to vertical
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
      orientationPlayerVessel = 1
      console.log('orientation vertical')
    }
  })
  // if space bar key up set orientation to horizontal
  document.addEventListener('keyup', (e) => {
    if (e.keyCode === 32) {
      orientationPlayerVessel = 0
      console.log('orientation horizontal')
    }
  })

  for (const button of vesselButtons) {
    button.addEventListener('click', (e) => {
      sizeOfVesselSelected = armada[e.target.value].size
      console.log(sizeOfVesselSelected)
      vesselSelected = armada[e.target.value]
      // return vesselSelected
      console.log(vesselSelected)
    })
  }

  // create array of playerGrid html elements so I can manipulate by index
  // const playerGridArray = Array.from(playerGrid.children)

  // add eventListeners for each cell in player grid
  for (const div of playerGrid.children) {
    div.addEventListener('mouseover', (e) => {
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
          // playerGridArray[indexMousePosition + i + 1].classList.remove('vessel')
          playerGridArray[indexMousePosition + (10 * i)].classList.toggle('vessel-hover')
        }
      }
    })

    div.addEventListener('mouseout', (e) => {
      indexMousePosition = Array.from(playerGrid.children).indexOf(e.target)
      if (orientationPlayerVessel === 0) {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          playerGridArray[indexMousePosition + i].classList.remove('vessel-hover')
        }
      } else {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          playerGridArray[indexMousePosition + (10 * i)].classList.remove('vessel-hover')
        }
      }
    })

    div.addEventListener('click', (e) => {
      if (!validPosition(e.target.id, sizeOfVesselSelected, orientationPlayerVessel)) return
      indexMousePosition = Array.from(playerGrid.children).indexOf(e.target)
      plonkShipPlayer(vesselSelected, orientationPlayerVessel, indexMousePosition)
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

  for (const div of computerGrid.children) {
    div.addEventListener('mouseover', (e) => {
      e.target.classList.toggle('vessel')
    })
    div.addEventListener('mouseout', (e) => {
      e.target.classList.toggle('vessel')
    })
    div.addEventListener('click', (e) => {
      playerTorpedo(e)
    })
  }

  function playerTorpedo(e) {
    // if cell clicked extract coordinates
    const checkX = e.target.id.split('')[1]
    const checkY = e.target.id.split('')[3]
    // check value of cell clicked
    if (computerBoard[checkY][checkX] === 0) {
      // if cell value is 0 add class miss
      document.getElementById(`c${checkX},${checkY}`).classList.add('miss')
      playerHit = 0
      turn = 0
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
    } return playerHit
  }

  function computerTorpedo() {
    // pick one at random and fire
    const cellBeingFiredUpon = cellsNotFiredUpon[Math.floor(Math.random() * cellsNotFiredUpon.length)]
    console.log('cell being fired upon is ', cellBeingFiredUpon)
    // if class === vessel register as hit
    if (playerGridArray[cellBeingFiredUpon].classList.contains('vessel')) {
      playerGridArray[cellBeingFiredUpon].classList.add('hit')
      // if hit, then remove that index from array
      const lastHitLocation = cellsNotFiredUpon.indexOf(cellBeingFiredUpon)
      cellsNotFiredUpon.splice(lastHitLocation, 1)
      // if hit vessel set hit to 1
      computerScore += 10
      computerHit = 1
      turn = 0
      // add below for more AI
      // while (computerHit === 1) {
      laserGuidance(cellBeingFiredUpon)
      // }
    } else {
      // change cell class to miss
      playerGridArray[cellBeingFiredUpon].classList.add('miss')
      // remove number from array
      cellsNotFiredUpon.splice(cellsNotFiredUpon.indexOf(cellBeingFiredUpon), 1)
      console.log('cells not fired upon ', cellsNotFiredUpon)
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
    console.log('torpedo just hit boat on ', lastHitLocation, 'coordinates are ', playerGridArray[lastHitLocation].id)
    console.log('cells not fired upon include ', cellsNotFiredUpon)
    console.log('direction (0 above, 1 right, 2 below, 3 left) is ', tryAdjacent)
    console.log('cellAbove fired upon ', cellAbove, 'cellRight fired upon ', cellRight, 'cellBelow fired upon ', cellBelow, 'cellLeft fired upon ', cellLeft)

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