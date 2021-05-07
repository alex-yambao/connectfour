//const state = [];
//let currentPlayer;


const gameBoard = $('.board');
const STATE = {
    gameBoard: createGameBoard(7, 7) 
}

/*first numbered index references ROW on console table  -- second references columns
  rows and columns are transversed on the rendered state board. (ex: filling bottom row on rendered board will fill entire 6th column of state table)*/
function createGameBoard(rows, columns) {
    let newArray = [];
    for (let i = 0; i < rows; i++) {
        newArray.push([])
         for (let j = 0; j < columns; j++){
            newArray[i].push(`row -${i} col -${j}`);
        } 
    }  return newArray;
}


    function renderBoard() {
        STATE.gameBoard.forEach((index, value) => {
            $('.board').append(`<div class='column' data-col='${value}'>ROW-${value}`);
        });
        STATE.gameBoard.forEach(function(index, value) {
        $('.column').append(`<div class='cell empty' data-col='${value}' data-row='${value}' data-cell='${value}'> COL-${value}`)
        });
    }
    


//toggle switch for active player 
$('.switch').on('input','input', function (e) {
    $(e.target).is(':checked') === true ? currentPlayer = 'red' : currentPlayer = 'yellow';
    $('.currentPlayer').text(`Current Player is ${currentPlayer}`);
});

//highlights target cell on mouse entry. 
gameBoard.on('mouseenter', '.column', function(e) {
    const col = $(e.target).data('col');
    const lastEmpty = isFilled(col);
    $(lastEmpty).addClass('highlight');
})

//removes highlight
gameBoard.on('mouseleave', '.column', function (e){
    const col = $(e.target).data('col');
    const lastEmpty = isFilled(col);
    $(lastEmpty).removeClass('highlight');
})


function isFilled(col) {
    const cells = $(`.column[data-col='${col}'] > .empty`);
    for (let i = cells.length - 1; i >= 0; i--) {
        const lastCell = $(cells[i]);
        if (lastCell.hasClass('empty')) {
           return lastCell; 
        } 
        }
        return null
    }


gameBoard.on('click', '.column', function(e) {
    const column = $(this).data('col'); 
    const fillTarget = $(`.column > .highlight`); //targets currently highlighted cell
    const cell = fillTarget.data('cell'); //targets currently highlighted cell
    fillTarget.addClass(`cell-${currentPlayer}`).removeClass('empty highlight');
    state[column][cell] = currentPlayer;
    checkWinner(currentPlayer, cell, column);
    currentPlayer = ( currentPlayer === 'red') ? 'yellow' : 'red';  
})



function checkWinner(currentPlayer, cell, column) {

    function checkSlices(arr, currentPlayer){ 
        let count = 0;
        arr.forEach(function(value) {
            if (value === currentPlayer) {
                count++
            }  else  { 
            return null
        } 
        checksCount(count)
        });
    };



    function checksCount(count) {
                console.log(count);
                if (count === 4) {      
                    return alert(`${currentPlayer} Wins`);
                } else {
                    return null
                }
            };  
            

    function checkSouth(currentPlayer, cell, column) {
        const colStart = column;
        const holdsVal = [currentPlayer];
        const start = cell;
        const downOne = start + 1;
        const downTwo = start + 2;
        const downThree = start + 3;
        const downFour = start + 4;
        const one = state[colStart].slice(downOne, downTwo) === undefined ? null : state[colStart].slice(downOne, downTwo); 
        const two = state[colStart].slice(downTwo, downThree)  === undefined  ? null : state[colStart].slice(downTwo, downThree);
        const three= state[colStart].slice(downThree, downFour)  === undefined ? null : state[colStart].slice(downThree, downFour);
        const finalVal = holdsVal.concat(one, two, three)  === undefined ? null : holdsVal.concat(one, two, three);
        
        if (finalVal === null) {
            return null
        } else {
        checkSlices(finalVal, currentPlayer);
        }
    }

    checkSouth(currentPlayer, cell, column);
    
    
    function checkSouthWest(currentPlayer, cell, column) {
        const colStart = column;
        const holdsVal = [currentPlayer];
        const rowStart = cell;
        const downTwo = rowStart + 2;
        const downOne = rowStart + 1;
        const downThree = rowStart + 3;
        const downFour = rowStart + 4;
        const leftOne = colStart - 1;
        const leftTwo = colStart - 2;
        const leftThree = colStart - 3;
        let one;
        let two;
        let three;
        if (state[colStart] === undefined) {
            return null 
        } else {
        one = state[leftOne].slice(downOne, downTwo)  === undefined ? null : state[leftOne].slice(downOne, downTwo);
        two = state[leftTwo].slice(downTwo, downThree)  === undefined ? null : state[leftTwo].slice(downTwo, downThree);
        three= state[leftThree].slice(downThree, downFour)  === undefined ? null : state[leftThree].slice(downThree, downFour);
        }
        const finalVal = holdsVal.concat(one, two, three)  === undefined ? null : holdsVal.concat(one, two, three);
        if (finalVal === null) {
            return null
        } else {
        checkSlices(finalVal, currentPlayer)
        } 
    }
    checkSouthWest(currentPlayer,cell, column);
    
        

    function checkSouthEast(currentPlayer, cell, column) {
        const colStart = column;
        const holdsVal = [currentPlayer];
        const rowStart = cell;
        const downOne = rowStart + 1;
        const downTwo = rowStart + 2;
        const downThree = rowStart + 3;
        const downFour = rowStart + 4;
        const rightOne = colStart + 1;
        const rightTwo = colStart + 2;
        const rightThree = colStart + 3;
        const one = state[rightOne].slice(downOne, downTwo)  === undefined ? null : state[rightOne].slice(downOne, downTwo);
        const two = state[rightTwo].slice(downTwo, downThree)  === undefined ? null : state[rightTwo].slice(downTwo, downThree);
        const three= state[rightThree].slice(downThree, downFour)  === undefined ? null : state[rightThree].slice(downThree, downFour);
        const finalVal = holdsVal.concat(one, two, three)  === undefined ? null : holdsVal.concat(one, two, three);
        if (finalVal === null) {
            return null
        } else {
        checkSlices(finalVal, currentPlayer)
        }
    }

    checkSouthEast(currentPlayer, cell, column);

    function checkEast(currentPlayer, cell, column) {
        const colStart = column;
        const holdsVal = [currentPlayer];
        const rowStart = cell;
        const rightOne = colStart + 1;
        const rightTwo = colStart + 2;
        const rightThree = colStart + 3;
        const rowPlusOne = cell + 1;
        const one = state[rightOne].slice(rowStart, rowPlusOne)  === undefined? null : state[rightOne].slice(rowStart, rowPlusOne);
        const two = state[rightTwo].slice(rowStart, rowPlusOne)  === undefined ? null : state[rightTwo].slice(rowStart, rowPlusOne);
        const three= state[rightThree].slice(rowStart, rowPlusOne)  === undefined ? null : state[rightThree].slice(rowStart, rowPlusOne);
        const finalVal = holdsVal.concat(one, two, three)  === undefined ? null : holdsVal.concat(one, two, three);
        if (finalVal === null) {
            return null
        } else {
        checkSlices(finalVal, currentPlayer)
        }
    } 
    checkEast(currentPlayer, cell, column)
    

    function checkWest(currentPlayer,cell, column) {
        const colStart = column;
        const holdsVal = [currentPlayer];
        const rowStart = cell;
        const leftOne = colStart - 1;
        const leftTwo = colStart - 2;
        const leftThree = colStart - 3;
        const rowPlusOne = cell + 1;
        const one = state[leftOne].slice(rowStart, rowPlusOne)  === undefined ? null : state[leftOne].slice(rowStart, rowPlusOne);
        const two = state[leftTwo].slice(rowStart, rowPlusOne)  === undefined ? null : state[leftTwo].slice(rowStart, rowPlusOne);
        const three= state[leftThree].slice(rowStart, rowPlusOne) === undefined ? null :  state[leftThree].slice(rowStart, rowPlusOne);
        }
        const finalVal = holdsVal.concat(one, two, three)   === undefined ? null : holdsVal.concat(one, two, three); 
        if (finalVal === null) {
            return null
        } else {
        checkSlices(finalVal, currentPlayer)
    }
    checkWest(currentPlayer, cell, column)
    

    function checkNorthWest(currentPlayer, cell, column){
        const colStart = column;
        const holdsVal = [currentPlayer];
        const rowStart = cell;
        const upOne = rowStart - 1;
        const upTwo = rowStart - 2;
        const upThree = rowStart - 3;
        const upFour = rowStart - 4;
        const leftOne = colStart - 1;
        const leftTwo = colStart - 2;
        const leftThree = colStart - 3;
        const one = state[leftOne].slice(upOne, rowStart) === undefined ? null : state[leftOne].slice(upOne, rowStart);
        const two = state[leftTwo].slice(upTwo, upOne)  === undefined ? null : state[leftTwo].slice(upTwo, upOne);
        const three= state[leftThree].slice(upThree, upTwo)  === undefined ? null : state[leftThree].slice(upThree, upTwo);  
        const finalVal = holdsVal.concat(one, two, three)  === undefined ? null : holdsVal.concat(one, two, three);
        if (finalVal === null) {
            return null
        } else {
        checkSlices(finalVal, currentPlayer)
        }
    }
    checkNorthWest(currentPlayer, cell, column)


    //note that rowStart is the origin and when slicing it goes from index 0 to end (left to right) - so calculating where to end the slice is tricky 
    //(ie if slicing from row 6, col 0 - your slice is calculated from original cell location so slice if slicing col 5 index from 6 you have to 6-1 and then use start as end point for slice) 

    function checkNorthEast(currentPlayer, cell, column){
        const colStart = column;
        const holdsVal = [currentPlayer];
        const rowStart = cell;
        const upOne = rowStart - 1;
        const upTwo = rowStart - 2;
        const upThree = rowStart - 3;
        const upFour = rowStart - 4;
        const rightOne = colStart + 1;
        const rightTwo = colStart + 2;
        const rightThree = colStart + 3;
        const one = state[rightOne].slice(upOne, rowStart)  === undefined ? null : state[rightOne].slice(upOne, rowStart);
        const two = state[rightTwo].slice(upTwo, upOne)  === undefined ? null : state[rightTwo].slice(upTwo, upOne);
        const three= state[rightThree].slice(upThree, upTwo)  === undefined ? null : state[rightThree].slice(upThree, upTwo);
        const finalVal = holdsVal.concat(one, two, three)  === undefined ? null : holdsVal.concat(one, two, three);
        if (finalVal === null) {
            return null
        } else {
        checkSlices(finalVal, currentPlayer)
        }
    }
    checkNorthEast(currentPlayer, cell, column);

}; 



function render() {
renderBoard() 
}

render();