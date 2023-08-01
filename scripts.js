const cells = document.querySelectorAll(".cell");
const historyContainer = document.getElementById('history');
const board = document.getElementById('board');
const statusText = document.querySelector("#statusText");
const resetBtn = document.querySelector("#resetBtn");
const prevNextBtnContainer = document.getElementById('prevNextBtnContainer');
const previousBtn = document.querySelector("#previousBtn");
const nextBtn = document.querySelector("#nextBtn");

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
let history = [];

const positions = {
    "0": "top left",
    "1": "top center",
    "2": "top right",
    "3": "middle left",
    "4": "middle",
    "5": "middle right",
    "6": "bottom left",
    "7": "bottom center",
    "8": "bottom right"
};

let previousContainer = [];
let nextContainer = [];

const modal = document.getElementById("modal")
const xPlayer = document.querySelector(".xPlayer")
const oPlayer = document.querySelector(".oPlayer")
const startGameOuter = document.querySelector(".startG")
const startGame = document.querySelector("#startG")



modal.addEventListener("click", function(e) {
    if (e.target.classList.contains("xPlayer")) {
        initializeGame(false);
        startGameOuter.classList.add("show")
    } 
    if (e.target.classList.contains("oPlayer")) {
        initializeGame(true);
        startGameOuter.classList.add("show")
    }
    if (circleTurn != undefined && e.target.id == "startG") {
        this.classList.remove("show")
    }
})


function initializeGame(isO) {
    circleTurn = isO
    cells.forEach(cell => cell.addEventListener("click", cellClicked, {once: true}))
    statusText.textContent = `Player ${circleTurn ? O_CLASS.toUpperCase() : X_CLASS.toUpperCase()}'s turn`;
    resetBtn.addEventListener("click", resetGame);
    running = true;
    setBoardHoverClass()
}


function resetGame(){
    options = ["", "", "", "", "", "", "", "", ""];
    history = [];
    nextContainer = [];
    previousContainer = [];
    toggleDisplay(prevNextBtnContainer)
    nextBtn.classList.remove("show")
    previousBtn.classList.add("show")
    historyContainer.innerHTML = "<p>History</p>"
    statusText.textContent = `Player ${circleTurn ? O_CLASS.toUpperCase() : X_CLASS.toUpperCase()}'s turn`;
    cells.forEach(cell => cell.className = "cell");
    cells.forEach(cell => cell.addEventListener("click", cellClicked, {once: true}))
    running = true;
}


function newGame() {  
    resetAllData();
    initializeGame();
    modal.classList.add("show")
    startGame.classList.remove("show")
}


function toggleDisplay(element) {
   if (!element.classList.contains("show") && !running) {
    element.classList.add("show")
   } else {
    element.classList.remove("show")
   }
}
const newGameBtn = document.getElementById('newGameBtn');
newGameBtn.addEventListener('click', newGame);


function resetAllData() {
    xPoints = 0;
    oPoints = 0;
    dPoints = 0;
    xScore.innerHTML = xPoints;
    oScore.innerHTML = oPoints;
    dScore.innerHTML = dPoints;
    options = ["", "", "", "", "", "", "", "", ""];
    history = [];
    nextContainer = [];
    previousContainer = [];
    toggleDisplay(prevNextBtnContainer)
    nextBtn.classList.remove("show")
    previousBtn.classList.add("show")
    historyContainer.innerHTML = "<p>History</p>"
    cells.forEach(cell => cell.className = "cell");

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
        history.push(`${currentClass} - ${positions[cell.getAttribute("cellindex")]}`)
        historyContainer.innerHTML += `<p class="history-item-${currentClass}-${cell.getAttribute("cellindex")}">${currentClass} - ${positions[cell.getAttribute("cellindex")]}</p>`
        nextContainer.push({symbol: currentClass, position: cell.getAttribute("cellindex")});
    }


    function previousMove() {
        if (nextContainer.length == 1) {
            previousBtn.classList.remove("show")
        }
        if (nextContainer.length > 0) {
            nextBtn.classList.add("show")
            let lastNext = nextContainer.pop()
            previousContainer.push(lastNext)
            document.querySelector(`[cellindex="${lastNext["position"]}"]`).classList.remove(lastNext["symbol"])
            document.querySelector(`.history-item-${lastNext["symbol"]}-${lastNext["position"]}`).classList.add("strikeThru")
        }
    }
    previousBtn.addEventListener("click", previousMove);


    function nextMove() {
        if (previousContainer.length == 1) {
            nextBtn.classList.remove("show")
        }
        if (previousContainer.length > 0) {
            previousBtn.classList.add("show")
            let lastPrev = previousContainer.pop()
            nextContainer.push(lastPrev);
            document.querySelector(`[cellindex="${lastPrev["position"]}"]`).classList.add(lastPrev["symbol"])
            document.querySelector(`.history-item-${lastPrev["symbol"]}-${lastPrev["position"]}`).classList.remove("strikeThru")
        } 
    }
    nextBtn.addEventListener("click", nextMove);


    function swapTurns() {
        circleTurn = !circleTurn
        statusText.textContent = `Player ${circleTurn ? O_CLASS.toUpperCase() : X_CLASS.toUpperCase()}'s turn`;
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
            statusText.textContent = `🚀Player ${circleTurn ? O_CLASS.toUpperCase() : X_CLASS.toUpperCase()} wins!🚀`;
            running = false;
            toggleDisplay(prevNextBtnContainer)

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
            statusText.textContent = `It's a Draw!`;
            running = false;
            toggleDisplay(prevNextBtnContainer)
            dPoints++
            dScore.innerHTML = dPoints
        }
        else{
            swapTurns();
        }
    }