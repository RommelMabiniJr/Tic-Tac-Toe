const Gameboard = (function (doc) {
    const BOARD_SIDES = 3;
    let _gameboard = []
    let _count = 0

    const create = () => {
        for (let row = 0; row < 3; row++) {
            _gameboard[row] = [null,null,null];
        }
    }

    const _counter = () => {
        return () => {
            ++_count
        }
    }

    const takeCell = (player, [row,column]) => {
        if (_gameboard[row][column] == null) {
            _gameboard[row][column] = player.getRole()
        } else {
            console.log("Error: slot is taken!!")
        }
    }


    const displayContents = function () {
        const cells = doc.querySelectorAll(".col")
        let index = 0;

        for (let row = 0; row < BOARD_SIDES; row++) {
            for (let column = 0; column < BOARD_SIDES; column++) {
                if (_gameboard[row][column] !== null) {
                    cells[index].innerText = _gameboard[row][column];
                }
                console.log(cells[index])
                index++
            }
        }
    }

    const showCurrentBoardState = () => console.log(_gameboard)

    return {create,takeCell,showCurrentBoardState,displayContents}

})(document);


const Player = (name, role) => {
    const getName = () => name
    const getRole = () => role

    const move = () => {

    }

    return {getName, getRole}
}

Gameboard.create()
let player1 = Player("Rommel", "X")
let AI = Player("AI Bot", "O")

Gameboard.takeCell(player1,[0,1])
Gameboard.takeCell(AI,[0,2])
Gameboard.takeCell(AI,[1,2])
Gameboard.takeCell(AI,[2,2])
Gameboard.showCurrentBoardState()
Gameboard.displayContents()
//
//console.log(player1.getName())