function functionName() {

  // dimensions of grids
  const rows = 10
  const cols = 10

  const humanGrid = document.querySelector('#human')
  const machineGrid = document.querySelector('#machine')

  // randomly generated coordinates
  let randomX
  let randomY

  // randomly generated orientation (horizontal or vertical)
  let orientation

  // properties of vessels
  const carrier = {
    type: 'carrier',
    length: 5
  }
  const battleship = {
    type: 'battleship',
    length: 4
  }
  const cruiser = {
    type: 'cruiser',
    length: 3
  }
  const destroyer = {
    type: 'destroyer',
    length: 2
  }
  const submarine = {
    type: 'submarine',
    length: 1
  }

  const armada = [carrier, battleship, cruiser, destroyer, destroyer, submarine, submarine]

  // create empty array
  const computerBoard = []
  const humanBoard = []
  let machineCell

  // at start push 0's to Boards
  // 0 = water, 1 = part of vessel, 2 = hit, 3 = miss
  const cellState = []

  for (let i = 0; i < cols; i++) {
    cellState.push(0)
  }

  for (let i = 0; i < rows; i++) {
    computerBoard.push(cellState)
    humanBoard.push(cellState)
  }

  // create html elements for boards
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {

      // create a new div for each grid cell
      const machineCell = document.createElement('div')
      machineGrid.appendChild(machineCell)
      const humanCell = document.createElement('div')
      humanGrid.appendChild(humanCell)

      // give each div element a coordinate
      machineCell.id = x + ',' + y
      humanCell.id = x + ',' + y

      // push coordinates into 2d array
      // machineCells.push([x, y])
      // machineCells.push(y)

      // humanCells.push([x, y])

      // show me coordinates to test it's working
      machineCell.innerHTML = machineCell.id
      humanCell.innerHTML = humanCell.id
      
    }
  }
  
  // generate random number for orientation - 0 for horizontal, 1 for vertical
  
  
  
  // function to randomly select starting coordinates for placement of vessels for given orientation and vessel length
  function anchor(vessel) {
    orientation = Math.floor(Math.random() * 2)
    if (orientation === 0) {
      // if horizontal, limit x coordinates to cols + 1 - vessel length
      randomX = Math.floor(Math.random() * (cols + 1 - vessel.length))
      randomY = Math.floor(Math.random() * rows)
    } else {
      // if vertical, limit y coordinates to rows + 1 - vessel length
      randomX = Math.floor(Math.random() * cols)
      randomY = Math.floor(Math.random() * (rows + 1 - vessel.length))
    }
    return [randomX, randomY, orientation]
  }

  // const test = anchor(carrier,1)
  // console.log(test)
  // console.log(test[0])
  // console.log(test[1])


  function checkSpace(vessel, orientation, randomX, randomY) {
    // take random anchor and check adjacent cells for space
    if (orientation === 0) {
      for (let i = 0; i < vessel.length; i++) {
        return computerBoard[randomX + i][randomY] === 0
      }
    } else {
      for (let i = 0; i < vessel.length; i++) {
        return computerBoard[randomX][randomY + i] === 0
      }
    }
  }

  // console.log(checkSpace(carrier, 1, 1, 2))

  function plonkShip(vessel, orientation, randomX, randomY) {
    if (orientation === 0) {
      for (let i = 0; i < vessel.length; i++) {
        computerBoard[randomX + i][randomY] = 1
        const location = [randomX + i, randomY].toString()
        console.log(location)
        // change corresponding cell's background color to check if working
        // document.getElementById(`${location}`).classList.add('.vessel')
      }
    } else {
      for (let i = 0; i < vessel.length; i++) {
        computerBoard[randomX][randomY + i] = 1
        const location = [randomX, randomY + i].toString()
        console.log(location)
        // change corresponding cell's background color to check if working
        // document.getElementById(`${location}`).classList.add('.vessel')
      }
    }
  }

  // console.log(plonkShip(carrier, 0, 1, 3))

  function deployFleet() {
    armada.forEach((vessel) => {
      let deployed = 0
      while (deployed < 1) {
        const anchorOut = anchor(vessel)
        if (checkSpace(vessel, anchorOut[2], anchorOut[0], anchorOut[1])) {
          plonkShip(vessel, anchorOut[2], anchorOut[0], anchorOut[1])
          deployed = 1
        }
      }
    })
  }

  deployFleet()


}

document.addEventListener('DOMContentLoaded', functionName)