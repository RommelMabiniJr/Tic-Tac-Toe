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

    const straightChecker = (playerVal, [row, column]) => {
        const symbol = playerVal.getRole()
        
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
            alert(`Player ${playerVal.getName()} wins!!`)
        } else if (_moveCount == 9) {
            alert("It's a tie!!")
        }

        //console.log(`${dResult}${dReverseResult}${symbol}`)
        //console.log(diagonalTestReverse)
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
        _gameboard[row][column] = playerValue.getRole();
        _moveCounter()

        if (_moveCount >= 5) {
            straightChecker(playerValue, [row, column])
        }
    }

    const setPlayers = (player1, player2) => {
        
        _players = {
            p1 : Player(player1.name, player1.selectedRole),
            p2 : Player(player2.name, player2.selectedRole)
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
        //console.log(_moveCount)
    }


    const showCurrentBoardState = () => console.log(_gameboard)

    return {create, cellIsEmpty, getGameBoard, setGameBoard, linkCellEvent, setPlayers, switchPlayer}

})();


const DisplayController = (function (doc) {
    const _BOARD_SIDES = 3;
    const _cells = doc.querySelectorAll(".col")
    const _proceed_btns = doc.querySelectorAll(".proceed-btn")
    const _swtch_btn = doc.querySelector(".switch-btn")
    const _outerGameBoard = doc.querySelector(".outer-gameboard")
    const _preGameContainer = doc.querySelector(".pre-game")
    const _p1Role = doc.querySelector(".p1-role")
    const _p2Role = doc.querySelector(".p2-role")

    const displayBoardContents = (gameObj) => {
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

    const getPlayersInfo = () => {
        const _playersInfo = doc.querySelectorAll('.player-containers')

        const players = []
        let defaultName = 1;

        _playersInfo.forEach(player => {
            const p_role = player.children[1].innerText
            const p_name = (player.children[2].value || defaultName)
            const temp = {name: p_name, selectedRole: p_role}
            
            players.push(temp)
            defaultName++
        })

        Gameboard.setPlayers(players[0], players[1])
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

        _proceed_btns.forEach(btn => {
            btn.addEventListener('click', () => {
                _preGameContainer.classList.toggle("hide")
                _outerGameBoard.classList.toggle("hide")
                
                //triggers the start of the game setup
                if (btn.classList.contains('arrowRight')) {
                    Game.start()
                }
            });
        })

        _swtch_btn.addEventListener('click', () => {
            toggleRoles()
        })
    }

    const toggleRoles = () => {
        if (_p1Role.innerText == "X") {
            _p1Role.innerText = "O"
            _p2Role.innerText = "X"
        } else {
            _p1Role.innerText = "X"
            _p2Role.innerText = "O"
        }
    }

    return {displayBoardContents, createListeners, getPlayersInfo}
})(document);


export const Game = ( function () {

    const initialize = () => {
        Gameboard.create();
        DisplayController.getPlayersInfo();
    }

    const start = () => {
        initialize();
    }

    const create = () => {
        DisplayController.createListeners();
    }

    return {start,create}
})();

const Player = (name, role) => {
    const getName = () => name
    const getRole = () => role

    const takeCell = function (row, column) {
        if (Gameboard.cellIsEmpty(row, column)) {
            Gameboard.setGameBoard(this, [row, column])
            Gameboard.switchPlayer()
        } else {
            console.log("Error: Cell is Taken")
        }
    }


    return {getName, getRole, takeCell}
}