const Gameboard = (function () {
    let _gameboard = [];
    let _moveCount = 0;
    let _players = {};
    let _roundState;
    let _currentPlayer;
    let _gameRound = 0;

    const create = () => {
        for (let row = 0; row < 3; row++) {
            _gameboard[row] = [null,null,null];
        }
    }
    

    const _moveCounter = () => ++_moveCount;
    const resetMoveCounts = () => _moveCount = 0;

    const _roundCounter = () => ++_gameRound;
    const resetRoundCounts = () => _gameRound = 0;

    const isRoundEnd = () => {
        let result = (_roundState == "finish") ? true : false
        if (result == true) {
            _roundState = ""
        }

        return result
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
            //alert(`Player ${playerVal.getName()} wins!!`)
            const msg = `${playerVal.getName()} wins!`
            const winningRole = playerVal.getRole()

            _roundCounter()
            DisplayController.setRound(_gameRound)

            playerVal.incrementScore()
            DisplayController.setWinner(msg, winningRole)
            //_currentPlayer = _players.p1
        } else if (_moveCount == 9) {
            const msg = "It's a tie!!"
            const winningRole = "X:O"

            _roundCounter()
            DisplayController.setRound(_gameRound)
            DisplayController.setWinner(msg, winningRole)
            switchPlayer()
        }


        DisplayController.displayScore(_players.p1, _players.p2);

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

    const setMoveInGameBoard = (playerValue, [row, column]) => {
        _gameboard[row][column] = playerValue.getRole();
        _moveCounter()
        switchPlayer()

        if (_moveCount >= 5) {
            straightChecker(playerValue, [row, column])
        }
    }

    const setPlayers = (player1, player2) => {
        
        //check game-mode
        if (DisplayController.isVsPlayer()) {
            _players = {
                p1 : Player(player1.name, player1.selectedRole),
                p2 : Player(player2.name, player2.selectedRole)
            }
        
        //vs AI    
        } else {
            _players = {
                p1 : Player(player1.name, player1.selectedRole),
                p2 : Player("AI", player2.selectedRole, 'AI')
            }
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

    const activateAITurn = () => {
        _currentPlayer.takeCell()
    }


    const showCurrentBoardState = () => console.log(_gameboard)

    return {create, cellIsEmpty, getGameBoard, setMoveInGameBoard, linkCellEvent, setPlayers, switchPlayer, resetMoveCounts, resetRoundCounts, getCurrentPlayer, isRoundEnd}

})();


const DisplayController = (function (doc) {
    const _gameModes = doc.querySelectorAll(".game-selection")
    const _BOARD_SIDES = 3;
    const _cells = doc.querySelectorAll(".col")
    const _proceed_btns = doc.querySelectorAll(".proceed-btn")
    const _swtch_btn = doc.querySelector(".switch-btn")
    const _outerGameBoard = doc.querySelector(".outer-gameboard")
    const _preGameContainer = doc.querySelector(".pre-game")
    const _p1Role = doc.querySelector(".p1-role")
    const _p2Role = doc.querySelector(".p2-role")
    const _winnerName = doc.querySelector(".w-name")
    const _winnerRole = doc.querySelector(".winner-role")
    const _gameResultCont = doc.querySelector(".game-result")
    const _homeBtn = doc.querySelector(".home")
    const _restartBtn = doc.querySelector(".restart")
    const _continueBtn = doc.querySelector(".continue")
    const _p1Score = doc.querySelector(".p1-score-actual")
    const _p2Score = doc.querySelector(".p2-score-actual")
    const _roundNum = doc.querySelector(".current-round")    

    let currentGameMode;

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

    const clearBoardContents = () => {
        let index = 0;

        for (let row = 0; row < _BOARD_SIDES; row++) {
            for (let column = 0; column < _BOARD_SIDES; column++) {
                _cells[index].innerText = "";
                //console.log(_cells[index])
                index++
            }
        }
    }

    const getPlayersInfo = () => {
        const _playersInfo = doc.querySelectorAll('.player-containers')
        const _pScoreName = doc.querySelectorAll(".p-score-name")


        const players = []
        let defaultName = 1;
        let indexing = 0

        _playersInfo.forEach(player => {
            const p_role = player.children[1].innerText
            const p_name = (player.children[2].value || `Player ${defaultName}`)
            const temp = {name: p_name, selectedRole: p_role}

            
            _pScoreName[indexing].innerText = `${p_name} :` //Formatting Name Score

            if (currentGameMode == "vsAI" && defaultName == 2) {
                _pScoreName[indexing].innerText = `AI :`
            }
            
            players.push(temp)
            defaultName++
            indexing++
        })


        Gameboard.setPlayers(players[0], players[1])
    }



    const requestAIMove = () => {
        const botObject = Gameboard.getCurrentPlayer()
        const botRole = botObject.getRole()
        const opposingRole = (botRole == "X") ? "O" : "X";
        let helper = AI(botRole, opposingRole)
        //console.log(Gameboard.getGameBoard())

        let AIMove = helper.findBestMove(Gameboard.getGameBoard())
        //console.log(`${AIMove.getRow()}${AIMove.getCol()}`)

        makeMove(AIMove.getRow() ,AIMove.getCol())
    }

    const makeMove = (row, column) => {
        Gameboard.linkCellEvent(row, column);
        displayBoardContents(Gameboard)
    }
    


    const createListeners = () => {
        _gameModes.forEach(mode => {
            mode.addEventListener('click', () => {
                currentGameMode = mode.value
                console.log(currentGameMode)
            })
        });

        _cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const row = cell.getAttribute("data-row-val")
                const column = cell.getAttribute("data-col-val")
                makeMove(row, column)

                //if vs AI mode, automatically let it make its move
                if (currentGameMode == "vsAI") {
                    if (Gameboard.getCurrentPlayer().getMode() == "AI") {
                        requestAIMove()
                    }
                }
            })
        });

        _proceed_btns.forEach(btn => {
            btn.addEventListener('click', () => {
                _preGameContainer.classList.toggle("hide")
                _outerGameBoard.classList.toggle("hide")
                
                //triggers the start of the game setup
                if (btn.classList.contains('arrowRight')) {
                    resets()
                    Game.start()
                }
            });
        })

        const resets = () => {
            clearBoardContents()
            Gameboard.resetMoveCounts()
        }

        _swtch_btn.addEventListener('click', () => {
            toggleRoles()
        })

        //reset all from the very start
        _homeBtn.addEventListener('click', () => {
            
        })

        //reset to role selection and name creation
        _restartBtn.addEventListener('click', () => {
            _preGameContainer.classList.toggle("hide")

            _gameResultCont.classList.toggle("hide")
            _gameResultCont.classList.toggle("show")
            _gameResultCont.classList.toggle("blurr")
            resets()

            //special reset to set game round to 1
            Gameboard.resetRoundCounts()
        })

        //continue game to next round
        _continueBtn.addEventListener('click', () => {
            _outerGameBoard.classList.toggle("hide")
            _gameResultCont.classList.toggle("hide")
            _gameResultCont.classList.toggle("show")
            _gameResultCont.classList.toggle("blurr")

            //this reset allows us to preserve the previous players state (e.g. scores)
            Gameboard.create()
            resets()
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

    const setWinner = (winOrTie, role) => {
        _winnerName.innerText = winOrTie;
        _winnerRole.innerText = role;
        displayGameResult()
    }

    const setRound = (round) => _roundNum.innerText = round;

    const displayScore = (playerOne, playerTwo) => {
        _p1Score.innerText = playerOne.getScore()
        _p2Score.innerText = playerTwo.getScore()
    }

    const displayGameResult = () => {
        _outerGameBoard.classList.toggle("hide")
        _gameResultCont.classList.toggle("hide")
        _gameResultCont.classList.toggle("show")
        _gameResultCont.classList.toggle("blurr")
    }

    const isVsPlayer = () => {
        var gameSelected = Array.from(_gameModes).find(mode => mode.checked)
        console.log(gameSelected.value)
        if (gameSelected.value == "vsPlayer") {
            return true
        }

        return false
    }

    return {displayBoardContents, createListeners, getPlayersInfo, setWinner, displayScore, setRound, isVsPlayer}
})(document);


export const Game = ( function () {

    //creates new board and players 
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

    return {start, create}
})();








const Player = (name, role, mode) => {
    let _score = 0;

    const getName = () => name
    const getRole = () => role
    const getScore = () => _score
    const getMode = () => mode

    const incrementScore = () => {
        ++_score
    }


    const takeCell = function (row, column) {
        //console.log(Gameboard.getGameBoard())
        //console.log(Gameboard.cellIsEmpty(row, column))

        if (Gameboard.cellIsEmpty(row, column)) {
            Gameboard.setMoveInGameBoard(this, [row, column])
        } else {
            console.log("Error: Cell is Taken")
        }
    }
        
    


    return {getName, getRole, takeCell, incrementScore, getScore, getMode}
}








const AI = (player, bot) => { 
    
    const move = (row, col) => {
        const getRow = () => row
        const getCol = () => col

        return {getRow,getCol}
    }

    const isMovesLeft = (board) => {
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (board[r][c] == null) {
                    return true
                }
            }
        }

        return false
    }


    const giveScore = (b, depth) => {
        //tests for rows
        for (let r = 0; r < 3; r++) {
            if (b[r][0] == b[r][1] && b[r][1] == b[r][2]) {
                if (b[r][0] == bot) {
                    return depth - 10

                } else if (b[r][0] == player) {
                    return 10 - depth
                }
            }
        }

        //tests for columns
        for (let c = 0; c < 3; c++) {
            if (b[0][c] == b[1][c] && b[1][c] == b[2][c]) {
                if (b[0][c] == bot) {
                    return depth - 10

                } else if (b[0][c] == player) {
                    return 10 - depth
                }
            }
        }

        //tests for diagonal
        if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
            if (b[0][0] == bot) {
                return depth - 10

            } else if (b[0][0] == player) {
                return 10 - depth
            }
        }

        if (b[0][2] == b[1][1] && b[1][1] == b[2][0]) {
            if (b[0][2] == bot) {
                return depth - 10

            } else if (b[0][2] == player) {
                return 10 - depth
            }
        }

        return 0;
    }

    //the minimax algo here is used for evaulating different outcomes of board states when a player moves
    function minimax(board, depth, alpha, beta, isMax) {
        let score = giveScore(board, depth)

        if (score > 0) {
            return score;
        }

        if (score < 0) {
            return score;
        }

        if (isMovesLeft(board) == false) {
            return 0;
        }

        //for max evaluation
        if (isMax) {
            let maxBest = -10000

            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (board[r][c] == null) {
                        board[r][c] = player;
                        //console.log("" + board[r][c] + "   " + r + c)
                        maxBest = Math.max(maxBest, minimax(board, depth + 1, alpha, beta, !isMax))
                        board[r][c] = null;

                        alpha = Math.max(alpha, maxBest)
                        if (beta <= alpha) {
                            break
                        }
                    }
                }
            }

            return maxBest
            
        } else {
            let minBest = 10000

            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (board[r][c] == null) {
                        board[r][c] = bot;
                        //console.log("" + board[r][c] + "   " + r + c)
                        minBest = Math.min(minBest, minimax(board, depth + 1, alpha, beta, !isMax))
                        board[r][c] = null;

                        beta = Math.min(beta, minBest)
                        if (beta <= alpha) {
                            break
                        }
                    }
                }
            }

            return minBest
        }
    }

    const findBestMove = (board) => {
        let bestVal = -10000
        const defaultVal = -1

        let bestMove = move(defaultVal, defaultVal)
        let alphaVal = -10000
        let betaVal = 10000

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (board[r][c] == null) {
                    
                    board[r][c] = player;
                    
                    let moveVal = minimax(board, 0, alphaVal, betaVal, false);
                    board[r][c] = null

                    
                    if (moveVal > bestVal) {
                        bestMove = move(r,c)
                        bestVal = moveVal
                    }
                }
            }
        }

        //console.log(bestVal)
        
        return bestMove
    } 

    return {findBestMove, giveScore}
}