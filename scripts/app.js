function functionName() {

  // dimensions of grids
  const rows = 10
  const cols = 10

  // html grids
  const humanGrid = document.querySelector('#human')
  const machineGrid = document.querySelector('#machine')
  // console.log(humanGrid)

  // randomly generated coordinates
  let randomX
  let randomY

  // randomly generated orientation (horizontal or vertical)
  let orientation = 0

  // properties of vessels
  const carrier = {
    name: 'carrier',
    length: 5
  }
  const battleship = {
    name: 'battleship',
    length: 4
  }
  const cruiser = {
    name: 'cruiser',
    length: 3
  }
  const destroyer1 = {
    name: 'destroyer',
    length: 2
  }
  const destroyer2 = {
    name: 'destroyer',
    length: 2
  }
  const submarine1 = {
    name: 'submarine',
    length: 1
  }
  const submarine2 = {
    name: 'submarine',
    length: 1
  }

  const armada = [carrier, battleship, cruiser, destroyer1, destroyer2, submarine1, submarine2]

  // create empty arrays that will store information of gameplay
  // const humanBoard =

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


  console.log(computerBoard)
  console.log(computerBoard[0])
  computerBoard[0][0] = 1
  console.log(computerBoard)
  let machineCell

  // at start push 0's to Boards
  // 0 = water, 1 = part of vessel, 2 = hit, 3 = miss
  const cellState = []


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


  const machineGridArray = Array.from(machineGrid.children)

  // function to randomly select starting coordinates for placement of vessels for given orientation and vessel length
  function anchor(vessel) {
    orientation = Math.floor(Math.random() * 2)
    if (orientation === 0) {
      // if horizontal, limit x coordinates to cols + 1 - vessel length
      randomY = Math.floor(Math.random() * rows)
      randomX = Math.floor(Math.random() * (cols + 1 - vessel.length))
    } else {
      // if vertical, limit y coordinates to rows + 1 - vessel length
      randomY = Math.floor(Math.random() * (rows + 1 - vessel.length))
      randomX = Math.floor(Math.random() * cols)
    }
    console.log('randomY is ' + randomY + ' randomX is ' + randomX + ' orientation is ' + orientation + ' vessel is ' + vessel.name)
    return [orientation, randomY, randomX]
  }

  // const test = anchor(carrier,1)
  // console.log(test)
  // console.log(test[0])
  // console.log(test[1])

  function checkSpace(vessel, orientation, randomY, randomX) {
    // take random anchor and check adjacent cells for space
    // let spaceForVessel = 0
    // debugger;
    if (orientation === 0) {
      for (let i = 0; i < vessel.length; i++) {
        const cellState = computerBoard[randomY][randomX + i]
        console.log('cell state ', cellState)
        if (cellState !== 0) {
          return 0
        }
      }
    } else if (orientation === 1) {
      for (let i = 0; i < vessel.length; i++) {
        const cellState = computerBoard[randomY + i][randomX]
        console.log('cell state ', cellState)
        if (cellState !== 0) {
          return 0
        }
      }
    }
    return 1
  }

  function plonkShip(vessel, orientation, randomY, randomX) {
    if (orientation === 0) {
      for (let i = 0; i < vessel.length; i++) {
        computerBoard[randomY][randomX + i] = 1
        const location = [randomY, randomX + i].toString()
        console.log(location)
        // change corresponding cell's background color to check if working
        // document.getElementById(`${location}`).classList.add('.vessel')
      }
    } else {
      for (let i = 0; i < vessel.length; i++) {
        computerBoard[randomY + i][randomX] = 1
        const location = [randomY + i, randomX].toString()
        console.log(location)
        // change corresponding cell's background color to check if working
        // document.getElementById(`${location}`).classList.add('.vessel')
      }
    }
  }

  console.log(plonkShip(carrier, 0, 1, 3))
  console.log(computerBoard)

  function deployFleet() {
    armada.forEach((vessel) => {
      let deployed = false
      while (deployed === false) {
        const anchorOut = anchor(vessel)
        if (checkSpace(vessel, anchorOut[0], anchorOut[1], anchorOut[2]) === 1) {
          console.log('checkSpace for ' + vessel.name + ' is ' + checkSpace(vessel, anchorOut[0], anchorOut[1], anchorOut[2]))
          plonkShip(vessel, anchorOut[0], anchorOut[1], anchorOut[2])
          deployed = true
        } else {
          deployed = false
          console.log('checkSpace for ' + vessel.name + ' is ' + checkSpace(vessel, anchorOut[0], anchorOut[1], anchorOut[2]))
        }
      }
    })
    console.log(computerBoard)

  }

  const button = document.querySelector('.magic')

  button.addEventListener('click', () => {
    deployFleet()
  })

  // console.log(typeof(machineGrid.children))
  // console.log(machineGrid.children)
  // console.log(Object.keys(machineGrid.children))
  // console.log(typeof(machineCell))


  const vesselButtons = document.querySelector('.vessel-icons').children
  // console.log(vesselButtons)

  let vesselSelected
  let sizeOfVesselSelected
  // orientation 0 for horizontal and 1 for vertical
  let orientationPlayerVessel = 0

  // if space bar key down set orientation to vertical
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
      orientationPlayerVessel = 1
      console.log(orientationPlayerVessel)
    }
  })
  // if space bar key up set orientation to horizontal
  document.addEventListener('keyup', (e) => {
    if (e.keyCode === 32) {
      orientationPlayerVessel = 0
      console.log(orientationPlayerVessel)
    }
  })

  for (const button of vesselButtons) {
    button.addEventListener('click', (e) => {
      sizeOfVesselSelected = e.target.value
      vesselSelected = e.target.innerHTML
      console.log(sizeOfVesselSelected)
      console.log(vesselSelected)
    })
  }

  // for vessel selected grab size
  // highlight adjacent cells to right if horizontal, below if vertical

  // console.log(humanGrid.children)
  // console.log(Array.from(humanGrid.children))


  // create array of humanGrid html elements so I can manipulate by index
  const humanGridArray = Array.from(humanGrid.children)

  // document.addEventListener('keydown', (e) => {
  //   console.log(e.keyCode)
  // })



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
      const indexMousePosition = Array.from(humanGrid.children).indexOf(e.target)
      if (orientationPlayerVessel === 0) {
        for (let i = 0; i < sizeOfVesselSelected; i++) {
          humanGridArray[indexMousePosition + i].classList.add('vessel')
          humanGridArray[indexMousePosition + i].setAttribute('vessel-name', `${vesselSelected}`)
          // remove button of vessel if last of vessel class just deployed
          console.log(Array.from(vesselButtons).indexOf(vesselSelected))
          console.log(Array.from(vesselButtons))
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

  console.log(sizeOfVesselSelected)

  for (const div of machineGrid.children) {
    div.addEventListener('mouseover', (e) => {
      console.log(e.target.innerHTML)
      e.target.classList.toggle('vessel')
    })
    div.addEventListener('mouseout', (e) => {
      e.target.classList.toggle('vessel')
    })
  }


  // test computerTorpedo
  // start with array of all indices
  let cellsNotFiredUpon = Array.from(Array(100).keys())
  console.log(cellsNotFiredUpon)

  function computerTorpedo() {
    // pick one at random and fire
    const cellBeingFiredUpon = cellsNotFiredUpon[Math.floor(Math.random() * cellsNotFiredUpon.length)]
    // console.log(cellBeingFiredUpon)
    // if class = vessel register as hit
    if (humanGridArray[cellBeingFiredUpon].classList.contains('vessel')) {
      humanGridArray[cellBeingFiredUpon].classList.add('hit')
      // if hit, then remove that index from array
      cellsNotFiredUpon.splice(cellsNotFiredUpon.indexOf(cellBeingFiredUpon), 1)
      console.log(cellsNotFiredUpon)
    } else {
      // change cell class to miss
      humanGridArray[cellBeingFiredUpon].classList.add('miss')
      // remove number from array
      cellsNotFiredUpon.splice(cellsNotFiredUpon.indexOf(cellBeingFiredUpon), 1)
      console.log(cellsNotFiredUpon)
    }
  }

  document.addEventListener('keypress', (e) => {
    if (e.key === 't') {
      computerTorpedo()
    }
  })


}

document.addEventListener('DOMContentLoaded', functionName)