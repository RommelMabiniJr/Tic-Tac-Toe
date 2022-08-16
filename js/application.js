const Gameboard = (function () {
    let _gameboard = [];
    let _moveCount = 0;
    let _players = {};
    let _currentPlayer;

    const create = () => {
        for (let row = 0; row < 3; row++) {
            _gameboard[row] = [null,null,null];
        }
    }

    const _moveCounter = () => { 
        ++_moveCount
    }

    const straightChecker = (playerRole, [row, column]) => {
        const symbol = playerRole
        
        let colTest = [], diagonalTest = [], diagonalTestReverse = []

        for (let i = 0; i < 3; i++) {
            const element = _gameboard[i][column];
            colTest.push(element)
        }

        let r = 2;
        for (let c = 0; c < 3; c++) {

            const elem1 = _gameboard[c][c]
            const elem2 = _gameboard[r][c]
            diagonalTest.push(elem1)
            diagonalTestReverse.push(elem2)

            r--         
        }

        let colResult = colTest.every(slot => slot == symbol)
        let dResult = diagonalTest.every(slot => slot == symbol)
        let dReverseResult = diagonalTestReverse.every(slot => slot == symbol)
        let rowResult = _gameboard[row].every(slot => slot == symbol)

        if (colResult || rowResult || dResult || dReverseResult) {
            alert("We have a winner!!")
        } else if (_moveCount == 9) {
            alert("It's a tie!!")
        }

        console.log(`${dResult}${dReverseResult}${symbol}`)
        console.log(diagonalTestReverse)
    }

    const cellIsEmpty = (row,column) => {
        if (_gameboard[row][column] == null) {
            return true;
        } else {
            return false;
        }
    }

    const getGameBoard = () => {
        const board = _gameboard
        return board;
    }

    const setGameBoard = (playerValue, [row, column]) => {
        _gameboard[row][column] = playerValue;
        _moveCounter()

        if (_moveCount >= 5) {
            straightChecker(playerValue, [row, column])
        }
    }


    const generatePlayers = () => {
        _players = {
            p1 : Player("Player 1", "X"),
            p2 : Player("Player 2", "O")
        }

        _currentPlayer = _players.p1
    }

    const switchPlayer = () => {
        if (_currentPlayer == _players.p1) {
            _currentPlayer = _players.p2 
        } else {
            _currentPlayer = _players.p1;
        }
    }

    const getCurrentPlayer = () => {
        return _currentPlayer
    }

    const linkCellEvent = (row, column) => {
        _currentPlayer.takeCell(row, column)
        console.log(_moveCount)
    }


    const showCurrentBoardState = () => console.log(_gameboard)

    return {create, cellIsEmpty, getGameBoard, setGameBoard, linkCellEvent, generatePlayers, switchPlayer}

})();


const DisplayController = (function (doc) {
    const _BOARD_SIDES = 3;
    const _cells = doc.querySelectorAll(".col")

    const displayBoardContents = function (gameObj) {
        const _gameboard = gameObj.getGameBoard()
        let index = 0;

        for (let row = 0; row < _BOARD_SIDES; row++) {
            for (let column = 0; column < _BOARD_SIDES; column++) {
                if (_gameboard[row][column] !== null) {
                    _cells[index].innerText = _gameboard[row][column];
                }
                //console.log(_cells[index])
                index++
            }
        }
    }


    const createListeners = () => {
        _cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const row = cell.getAttribute("data-row-val")
                const column = cell.getAttribute("data-col-val")

                Gameboard.linkCellEvent(row, column);
                displayBoardContents(Gameboard)
            })
        });
    }

    return {displayBoardContents,createListeners}
})(document);


export const Game = ( function () {

    const initialize = () => {
        Gameboard.create();
        Gameboard.generatePlayers();
        DisplayController.createListeners();
    }

    const start = () => {
        initialize();
    }


    return {start}
})();

const Player = (name, role) => {
    const getName = () => name
    const getRole = () => role

    const takeCell = (row, column) => {
        if (Gameboard.cellIsEmpty(row, column)) {
            Gameboard.setGameBoard(getRole(), [row, column])
            Gameboard.switchPlayer()
        } else {
            console.log("Error: Cell is Taken")
        }
    }

    return {getName, getRole, takeCell}
}