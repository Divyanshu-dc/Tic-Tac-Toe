
    const landingPage = document.getElementById("landingPage");
    const gamePage = document.getElementById("gamePage");
    const chooseXButton = document.getElementById("chooseX");
    const chooseOButton = document.getElementById("chooseO");
    const startButton = document.querySelector(".button");
    const myBoard = document.querySelector(".board");
    const gridCells = document.querySelectorAll(".cell");
    const statements = document.querySelector(".gameStatement");

    let gameStarted = false;
    let turn;
    let count = 0;

    var savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
        var gameState = JSON.parse(savedGameState);
        turn = gameState.turn;
        gameStarted = gameState.gameStarted;
        count = gameState.count;
        for (var i = 0; i < gridCells.length; i++) {
            gridCells[i].innerHTML = gameState.cells[i];
            if (gameState.cells[i] === "X") {
                gridCells[i].classList.add("X");
            } else if (gameState.cells[i] === "O") {
                gridCells[i].classList.add("O");
            }
        }
        if (gameStarted) {
            landingPage.style.display = "none";
            gamePage.style.display = "block";
            statements.innerHTML = `Player ${turn}'s turn`;
            startButton.innerHTML = "Reset";
        } else {
            landingPage.style.display = "block";
            gamePage.style.display = "none";
        }
    } else {
        landingPage.style.display = "block";
        gamePage.style.display = "none";
    }
    

    chooseXButton.addEventListener("click", () => {
        turn = "X";
        startGame();
    });

    chooseOButton.addEventListener("click", () => {
        turn = "O";
        startGame();
    });

    function startGame() {
        landingPage.style.display = "none";
        gamePage.style.display = "block";
        statements.innerHTML = `Player ${turn}'s turn`;
        saveGameState();
    }

    startButton.addEventListener("click", function() {
        resetGame();
        gameStarted = !gameStarted;
        startButton.innerHTML = gameStarted ? "Reset" : "Start";
        if (gameStarted) {
            statements.innerHTML = `Player ${turn}'s turn`;
        }
        saveGameState();
    });

    myBoard.addEventListener("click", function(event) {
        if (gameStarted && event.target.classList.contains('cell') && event.target.innerHTML === "") {
            event.target.innerHTML = turn;
            event.target.classList.add(turn);
            count++;
            
            if (checkWinner()) {
                statements.innerHTML = `Player ${turn} wins!`;
                gameStarted = false;
                startButton.innerHTML = "Start";
                setTimeout(function(){
                    statements.innerHTML="";
                    startButton.innerHTML = "Game is Re-Starting...";
                    setTimeout(function(){
                        startButton.click();
                    },3000)
                },3000);
                saveGameState();
                return;
            }

            if (count === 9) {
                statements.innerHTML = "It's a draw!";
                gameStarted = false;
                startButton.innerHTML = "Start";
                setTimeout(function(){
                    statements.innerHTML="";
                    startButton.innerHTML = "Game is Re-Starting...";
                    setTimeout(function(){
                        startButton.click();
                    },3000)
                },3000);
                saveGameState();
                return;
            }

            turn = turn === "X" ? "O" : "X";
            statements.innerHTML = `Player ${turn}'s turn`;
            saveGameState();
        }
    });

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]             
        ];

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (gridCells[a].innerHTML && gridCells[a].innerHTML === gridCells[b].innerHTML && gridCells[a].innerHTML === gridCells[c].innerHTML) {
                return true;
            }
        }
        return false;
    }

    function resetGame() {
        gridCells.forEach(cell => {
            cell.innerHTML = "";
            cell.classList.remove("X", "O");
        });
        turn;
        count = 0;
        statements.innerHTML = "";
        saveGameState();
    }
   
    function saveGameState() {
        var gameState = {
            turn: turn,
            gameStarted: gameStarted,
            count: count,
            cells: Array.from(gridCells).map(function(cell) {
                return cell.innerHTML;
            })
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }