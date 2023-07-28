const cells = document.querySelectorAll(".cell");
const board = document.getElementById('board');
const statusText = document.querySelector("#statusText");
const resetBtn = document.querySelector("#resetBtn");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let running = false
const X_CLASS = 'x'
const O_CLASS = 'o'
let circleTurn
const playSound = new Audio("sounds/click-sound.wav");
const xScore = document.querySelector(".x-score");
const oScore = document.querySelector(".o-score");
const dScore = document.querySelector(".d-score");
let xPoints = 0
let oPoints = 0
let dPoints = 0


initializeGame();

function initializeGame() {
    circleTurn = false
    cells.forEach(cell => cell.addEventListener("click", cellClicked, {once: true}))
    statusText.textContent = `${circleTurn ? O_CLASS.toUpperCase() : X_CLASS.toUpperCase()}'s turn`;
    resetBtn.addEventListener("click", resetGame);
    running = true;
    setBoardHoverClass()
}

function resetGame(){
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${circleTurn ? O_CLASS.toUpperCase() : X_CLASS.toUpperCase()}'s turn`;
    cells.forEach(cell => cell.className = "cell");
    cells.forEach(cell => cell.addEventListener("click", cellClicked, {once: true}))
    running = true;
}

function cellClicked(e){
    const cell = e.target 
    const currentClass = circleTurn ? O_CLASS : X_CLASS

    if (running) {
        updateCell(cell, currentClass)
        checkWinner()
    }
    setBoardHoverClass()
}

    function updateCell(cell, currentClass) {
        cell.classList.add(currentClass)
        options[cell.getAttribute("cellindex")] = currentClass
    }

    function swapTurns() {
        circleTurn = !circleTurn
        statusText.textContent = `${circleTurn ? O_CLASS.toUpperCase() : X_CLASS.toUpperCase()}'s turn`;
        playSound.play()
    }

    function setBoardHoverClass() {
        board.classList.remove(X_CLASS)
        board.classList.remove(O_CLASS)
        if (circleTurn) {
            board.classList.add(O_CLASS)
        } else {
            board.classList.add(X_CLASS)
        }
    }

    function checkWinner(){
        let roundWon = false;
    
        for(let i = 0; i < winConditions.length; i++){
            const condition = winConditions[i];
            const cellA = options[condition[0]];
            const cellB = options[condition[1]];
            const cellC = options[condition[2]];
    
            if(cellA == "" || cellB == "" || cellC == ""){
                continue;
            }
            if(cellA == cellB && cellB == cellC){
                roundWon = true;
                break;
            }
        }
    
        if(roundWon){
            statusText.textContent = `${circleTurn ? O_CLASS.toUpperCase() : X_CLASS.toUpperCase()} wins!`;
            running = false;

            if(circleTurn){
                oPoints++
                oScore.innerHTML = oPoints
            }
            else {
                xPoints++
                xScore.innerHTML = xPoints
            
            }
        }
        else if(!options.includes("")){
            statusText.textContent = `Draw!`;
            running = false;
            dPoints++
            dScore.innerHTML = dPoints
        }
        else{
            swapTurns();
        }
    }





