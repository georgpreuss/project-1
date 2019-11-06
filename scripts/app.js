function functionName() {

  // dimensions of grids
  const rows = 10
  const cols = 10

  // html grids
  const humanGrid = document.querySelector('#human')
  const machineGrid = document.querySelector('#machine')

  // create html elements with xy coordinates for each of the gameboards
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {

      // create a new div for each grid cell
      const machineCell = document.createElement('div')
      machineGrid.appendChild(machineCell)
      const humanCell = document.createElement('div')
      humanGrid.appendChild(humanCell)

      // give each div element a coordinate
      machineCell.id = 'c' + x + ',' + y
      humanCell.id = x + ',' + y

      // give each div visible coordinates for testing
      // machineCell.innerHTML = x + ',' + y
      // humanCell.innerHTML = x + ',' + y
    }
  }

  // variables to store randomly generated coordinates
  let randomX
  let randomY

  // randomly generated orientation (0 for horizontal or 1 for vertical) for placement of computer's vessels
  let orientation = 0

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
    if (orientation === 0) {
      for (let i = 0; i < vessel.size; i++) {
        computerBoard[randomY][randomX + i] = vessel.abb
      }
    } else {
      for (let i = 0; i < vessel.size; i++) {
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

  }

  const startButton = document.querySelector('.commence')

  const playerTurn = document.querySelector('#turn')

  let computerHit = 1
  let playerHit = 1
  let turn
  startButton.addEventListener('click', () => {
    // remove event listeners for playerBoard!
    deployFleet()
    // random generator to determine who starts: 0 for computer, 1 for player
    turn = Math.floor(Math.random() * 2)
    while (turn === 0) {
      playerTurn.innerHTML = 'Computer\'s turn'
      while (computerHit === 1) {
        computerTorpedo()
      }
    }
  })

  const vesselButtons = document.querySelector('.player-info').children

  let vesselSelected
  let sizeOfVesselSelected
  // orientation 0 for horizontal and 1 for vertical
  let orientationPlayerVessel = 0

  // if space bar key down set orientation to vertical
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
      orientationPlayerVessel = 1
    }
  })
  // if space bar key up set orientation to horizontal
  document.addEventListener('keyup', (e) => {
    if (e.keyCode === 32) {
      orientationPlayerVessel = 0
    }
  })

  for (const button of vesselButtons) {
    button.addEventListener('click', (e) => {
      sizeOfVesselSelected = e.target.value
      vesselSelected = e.target.innerHTML
    })
  }

  // create array of humanGrid html elements so I can manipulate by index
  const humanGridArray = Array.from(humanGrid.children)

  // add eventListeners for each cell in grid
  for (const div of humanGrid.children) {
    div.addEventListener('mouseover', (e) => {
      // grab the index of the cell mouse is over
      const indexMousePosition = Array.from(humanGrid.children).indexOf(e.target)
      // based on vessel selected highlight adjacent cells for length of vessel
      if (orientationPlayerVessel === 0) {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          humanGridArray[indexMousePosition + i].classList.toggle('vessel-hover')
        }
      } else {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          // humanGridArray[indexMousePosition + i + 1].classList.remove('vessel')
          humanGridArray[indexMousePosition + (10 * i)].classList.toggle('vessel-hover')
        }
      }
    })

    div.addEventListener('mouseout', (e) => {
      const indexMousePosition = Array.from(humanGrid.children).indexOf(e.target)
      if (orientationPlayerVessel === 0) {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          humanGridArray[indexMousePosition + i].classList.remove('vessel-hover')
        }
      } else {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          // humanGridArray[indexMousePosition + i + 1].classList.remove('vessel')
          humanGridArray[indexMousePosition + (10 * i)].classList.remove('vessel-hover')
        }
      }
      // e.target.classList.toggle('vessel')
    })

    div.addEventListener('click', (e) => {
      console.log('Is this a valid position??? :', validPosition(e.target.id, sizeOfVesselSelected, orientation))
      // if (validPosition(e.target.id, sizeOfVesselSelected, orientation)) return
      const indexMousePosition = Array.from(humanGrid.children).indexOf(e.target)
      if (orientationPlayerVessel === 0) {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          humanGridArray[indexMousePosition + i].classList.add('vessel')
          humanGridArray[indexMousePosition + i].setAttribute('vessel-name', `${vesselSelected}`)
          // remove button of vessel if last of vessel class just deployed
          // console.log(Array.from(vesselButtons).indexOf(vesselSelected))
          // console.log(Array.from(vesselButtons))
        }
      } else {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          // humanGridArray[indexMousePosition + i + 1].classList.remove('vessel')
          humanGridArray[indexMousePosition + (10 * i)].classList.add('vessel')
          humanGridArray[indexMousePosition + (10 * i)].setAttribute('vessel-name', `${vesselSelected}`)
          // remove button of vessel if last of vessel class just deployed
          // don't let user place more than number available of each vessel type
        }
      }
    })
  }

  function validPosition(id, length, orientation) {
    // debugger;
    if (orientation === 0) {
      const startX = parseInt(id.split(',')[0])
      const endX = startX + parseInt(length)
      return endX >= 9 ? false : true
    } else {
      return parseInt(id.split(',')[1]) + length > 9 ? true : false
    }
  }

  for (const div of machineGrid.children) {
    div.addEventListener('mouseover', (e) => {
      // console.log(e.target.innerHTML)
      e.target.classList.toggle('vessel')
    })
    div.addEventListener('mouseout', (e) => {
      e.target.classList.toggle('vessel')
    })
    div.addEventListener('click', (e) => {
      playerTorpedo(e)
    })
  }

  const showScore = document.querySelector('.score')
  let score = 0

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

  // computerTorpedo function to start with array of all indices
  // this array will be reduced to not fire on the same cell more than once
  let cellsNotFiredUpon = Array.from(Array(100).keys())

  let computerScore = 0
  function computerTorpedo() {
    // pick one at random and fire
    const cellBeingFiredUpon = cellsNotFiredUpon[Math.floor(Math.random() * cellsNotFiredUpon.length)]
    // console.log(cellBeingFiredUpon)
    // if class === vessel register as hit
    if (humanGridArray[cellBeingFiredUpon].classList.contains('vessel')) {
      humanGridArray[cellBeingFiredUpon].classList.add('hit')
      // if hit, then remove that index from array
      const lastHitLocation = cellsNotFiredUpon.indexOf(cellBeingFiredUpon)
      cellsNotFiredUpon.splice(lastHitLocation, 1)
      // console.log('just fired upon ', lastHitLocation)
      // console.log(cellsNotFiredUpon)
      // if hit vessel set hit to 1
      computerScore += 10
      computerHit = 1
      turn = 0
      // add below for more AI
      // while (computerHit === 1) {
      // console.log('guideMissile function input value is ', lastHitLocation)
      guidedMissile(lastHitLocation)
      // }
    } else {
      // change cell class to miss
      humanGridArray[cellBeingFiredUpon].classList.add('miss')
      // remove number from array
      cellsNotFiredUpon.splice(cellsNotFiredUpon.indexOf(cellBeingFiredUpon), 1)
      console.log(cellsNotFiredUpon)
      // if hit unsuccessful set hit to 0
      computerHit = 0
      turn = 1
    }
    return computerHit, turn
  }


  function guidedMissile(lastHitLocation) {
    // generate random number between 1 and 4 for all directions
    // const tryAdjacent = Math.floor(Math.random() * 4)
    const tryAdjacent = 0
    const cellAbove = cellsNotFiredUpon.includes(lastHitLocation - cols)
    const cellRight = cellsNotFiredUpon.includes(lastHitLocation + 1)
    const cellBelow = cellsNotFiredUpon.includes(lastHitLocation + cols)
    const cellLeft = cellsNotFiredUpon.includes(lastHitLocation - 1)
    console.log('torpedo just fired upon ', lastHitLocation, 'coordinates are ', humanGridArray[lastHitLocation].id)
    console.log('cells not fired upon include ', cellsNotFiredUpon)
    console.log('direction (0 above, 1 right, 2 below, 3 left) is ', tryAdjacent)
    console.log('cellAbove fired upon ', cellAbove, 'cellRight fired upon ', cellRight, 'cellBelow fired upon ', cellBelow, 'cellLeft fired upon ', cellLeft)
  }

}

document.addEventListener('DOMContentLoaded', functionName)