document.getElementById('restart').onclick = () => restartGame();


function restartGame() {
    document.getElementById('resultModal').style.display = 'none';
    document.getElementById('gameTable').innerHTML = '';
    difficultyDisplay.style.display = 'block';
    startGame();
}
document.getElementById('finish').onclick = () => finishGame();
document.getElementById('newGame').onclick = () => startNewGame();
document.getElementById('newGameOver').onclick = () => startNewGame();

function finishGame() {
    if (game.timeoutId) {
        clearTimeout(game.timeoutId);
    }

    game.disableAllCellClicks();
    game.displayGameResult();
}

function startNewGame() {
    document.getElementById('resultModal').style.display = 'none';
    document.getElementById('gameTable').innerHTML = '';
    document.getElementById('start').style.display = 'block';
    document.getElementById('difficulty_container').style.display = 'block';
    document.getElementById('finish').style.display = 'none';
    document.getElementById('newGame').style.display = 'none';
    difficultyDisplay.style.display = 'none';
}





class WhackAMoleGame {
    constructor(rows, cols, difficulty) {
        this.rows = rows;
        this.cols = cols;
        this.difficulty = difficulty;
        this.cells = [];
        this.highlightedCell = null;
        this.playerScore = 0;
        this.computerScore = 0;
        this.gameOver = false;

        this.createTable();
    }

    createTable() {
        const table = document.getElementById('gameTable');
        for (let i = 0; i < this.rows; i++) {
            const row = table.insertRow(i);
            this.cells[i] = [];
            for (let j = 0; j < this.cols; j++) {
                const cell = row.insertCell(j);
                cell.style.pointerEvents = 'none';  // Initially, make all cells unclickable
                cell.addEventListener('click', ((row, col) => () => this.cellClick(row, col))(i, j));
                this.cells[i][j] = cell;
            }
        }
    }

    enableCellClick(row, col) {
        this.cells[row][col].style.pointerEvents = 'auto';  // Enable click for the specified cell
    }

    cellClick(row, col) {
        if (this.gameOver || this.cells[row][col].classList.contains('correct')) return;

        if (this.cells[row][col] === this.highlightedCell) {
            this.cells[row][col].classList.add('correct');
            this.playerScore++;
        } else {
            this.cells[row][col].classList.add('incorrect');
            this.computerScore++;
        }

        this.highlightedCell = null;
        this.checkGameEnd();
    }

    highlightRandomCell() {
        const row = Math.floor(Math.random() * this.rows);
        const col = Math.floor(Math.random() * this.cols);

        if (this.cells[row][col].classList.contains('correct') || this.cells[row][col].classList.contains('incorrect')) {
            this.highlightRandomCell();
        } else {
            this.cells[row][col].classList.add('highlight');
            this.highlightedCell = this.cells[row][col];

            // Clear existing timeouts before setting a new one
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }

            this.enableCellClick(row, col);  // Enable click for the highlighted cell
            this.timeoutId = setTimeout(() => this.unhighlightCell(row, col), this.getDifficultyInterval());
        }
    }

    unhighlightCell(row, col) {
        this.cells[row][col].classList.remove('highlight');

        if (!this.cells[row][col].classList.contains('correct')) {
            this.cells[row][col].classList.add('incorrect');
            this.computerScore++;
        }

        this.cells[row][col].style.pointerEvents = 'none';  // Disable click for the current cell
        this.highlightedCell = null;
        this.checkGameEnd();
    }

    getDifficultyInterval() {
        switch (this.difficulty) {
            case 'easy':
                return 1500;
            case 'medium':
                return 1000;
            case 'hard':
                return 500;
            default:
                return 1000;
        }
    }


    disableAllCellClicks() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.cells[i][j].style.pointerEvents = 'none';
            }
        }
    }

    checkGameEnd() {
        const totalCells = this.rows * this.cols;
        const targetCells = Math.ceil(totalCells / 2);

        if (this.playerScore >= targetCells || this.computerScore >= targetCells) {
            this.gameOver = true;
            this.disableAllCellClicks();
            this.displayGameResult();
        } else {
            this.highlightedCell = null;
            this.highlightRandomCell();
        }
    }

    displayGameResult() {
        let resultMessage;
        if (this.playerScore > this.computerScore) {
            resultMessage = 'You Win!';
        } else if (this.playerScore < this.computerScore) {
            resultMessage = 'Computer Wins!';
        } else {
            resultMessage = 'It\'s a Draw!';
        }
        document.getElementById('resultMessage').textContent = resultMessage;
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('computerScore').textContent = this.computerScore;
        document.getElementById('resultModal').style.display = 'flex';
    }
}

let game;

document.getElementById('start').onclick = () => startGame();

function startGame() {
    const difficultyContainer = document.getElementById('difficulty_container');
    const startButton = document.getElementById('start');
    const newGameButton = document.getElementById('newGame');
    const finishButton = document.getElementById('finish');
    const difficultyDisplay = document.getElementById('difficultyDisplay');
    const difficultyDisplayInner = document.getElementById('difficultyDisplayInner');

    difficultyContainer.style.display = 'none';
    startButton.style.display = 'none';
    newGameButton.style.display = 'block';
    finishButton.style.display = 'block';

    const difficulty = document.getElementById('difficulty').value;

    // Display the difficulty level to the user using DOM manipulation
    difficultyDisplay.style.display = 'block';

    difficultyDisplayInner.textContent = ` ${difficulty}`;


    game = new WhackAMoleGame(10, 10, difficulty);
    game.highlightRandomCell();
}

