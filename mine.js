document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.title');
    const top = document.querySelector('.top');
    const board = document.querySelector('.board');
    const flagsLeft = document.querySelector('#flags-left');
    const timer = document.querySelector('#timer');
    const emojiBtn = document.querySelector('.emoji-btn');
    const levelSelect = document.querySelector('#level-select');

    let width = 9;
    let height = 9;
    let bombAmount = 10;
    let flags = 0;
    let cells = [];
    let isGameOver = false;
    let time = 0;
    let isFirstClick = true;
    let timerInterval= 0;

    function createBoard() {
        let boardArray = Array(width * height - bombAmount).fill('normal');
        let bombArray = Array(bombAmount).fill('bomb');
        boardArray = boardArray.concat(bombArray);
        boardArray.sort(() => Math.random() - 0.5);
        boardArray.sort(() => Math.random() - 0.5); // shuffled twice because the first shuffle was not even

        emojiBtn.innerHTML = '🙂';
        flagsLeft.innerHTML = bombAmount;

        for (let i = 0; i < width * height; i++) {
            const cell = document.createElement('cell');
            cell.setAttribute('id', i);
            cell.classList.add(boardArray[i]);
            board.appendChild(cell);
            cells.push(cell);

            cell.addEventListener('click', () => {
                click(cell);
            });

            cell.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(cell);
            }
        }

        for (let k = 0; k < cells.length; k++) {
            let bombCount = 0;

            if (cells[k].classList.contains('normal')) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let y = parseInt(k / width);
                        let x = parseInt(k % width);
                        if (x + j >= 0 && x + j < width && y + i >= 0 && y + i < height) {
                            let cell = document.getElementById((x + j) + (y + i) * width);
                            if (cell.classList.contains('bomb'))
                                bombCount++;
                        }
                    }
                }
            }
            cells[k].setAttribute('data', bombCount);
        }
    }
    createBoard();

    function click(cell) {
        let currenCell = cell.id;

        if (isGameOver)
            return;
        if (cell.classList.contains('clicked') || cell.classList.contains('flag'))
            return;
        if (cell.classList.contains('bomb')) {
            cell.classList.add('clicked');
            gameOver();
        } else {
            let bombCount = cell.getAttribute('data');
            if (bombCount != 0) {
                cell.innerHTML = bombCount;
                if (bombCount == 1)
                    cell.classList.add('one');
                if (bombCount == 2)
                    cell.classList.add('two');
                if (bombCount == 3)
                    cell.classList.add('three');
                if (bombCount == 4)
                    cell.classList.add('four');
                if (bombCount == 5)
                    cell.classList.add('five');
                if (bombCount == 6)
                    cell.classList.add('six');
                if (bombCount == 7)
                    cell.classList.add('seven');
                if (bombCount == 8)
                    cell.classList.add('eight');
                cell.classList.add('clicked');
                return;
            }
            floodFill(currenCell);
        }
        cell.classList.add('clicked');
    }

    function floodFill(currentCell) {
        let y = parseInt(currentCell / width);
        let x = parseInt(currentCell % width);
        setTimeout(() => {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (x + j >= 0 && x + j < width && y + i >= 0 && y + i < height) {
                        let cell = document.getElementById((x + j) + (y + i) * width);
                        if (!cell.classList.contains('clicked')) {
                            click(cell);
                        }
                    }
                }
            }
        }, 10);
    }

    function addFlag(cell) {
        if (isGameOver)
            return;
        if (!cell.classList.contains('clicked') && !cell.classList.contains('flag') && flags < bombAmount) {
            cell.classList.add('flag');
            cell.innerHTML = '🚩';
            flags++;
            flagsLeft.innerHTML = bombAmount - flags;
            checkWin();
        } else if (cell.classList.contains('flag')) {
            cell.classList.remove('flag');
            cell.innerHTML = '';
            flags--;
            flagsLeft.innerHTML = bombAmount - flags;
        }
    }

    function checkWin() {
        let counts = 0;

        for (let i = 0; i < cells.length; i++) {
            if (cells[i].classList.contains('flag') && cells[i].classList.contains('bomb')) {
                counts++;
            }
            if (counts === bombAmount) {
                isGameOver = true;
                emojiBtn.innerHTML = '😎';
            }
        }
    }

    function gameOver() {
        isGameOver = true;
        emojiBtn.innerHTML = '😫';
        cells.forEach(cell => {
            if (cell.classList.contains('flag') && cell.classList.contains('bomb')) {
                cell.innerHTML = '❌';
            }
            if (cell.classList.contains('bomb')) {
                cell.innerHTML = '💣';
            }
            if (cell.classList.contains('bomb') && cell.classList.contains('clicked')) {
                cell.innerHTML = '💥';
            }
        });
    }

    board.addEventListener('click', () => {
        if (isFirstClick) {
            isFirstClick = false;
            timerInterval = setInterval(() => {
                time++;
                timer.innerHTML = time;
                if (isGameOver) {
                    clearInterval(timerInterval);
                }
            }, 1000);
        }
    });

    emojiBtn.addEventListener('click', () => {
        isGameOver = false;
        isFirstClick = true;
        time = 0;
        flags = 0;
        timer.innerHTML = time;
        if (levelSelect.value === 'easy') {
            width = 9;
            height = 9;
            bombAmount = 10;
        } else if (levelSelect.value === 'normal') {
            width = 16;
            height = 16;
            bombAmount = 40;
        } else if (levelSelect.value === 'hard') {
            width = 30;
            height = 16;
            bombAmount = 99;
        }
        title.style.width = 25 * width + 15 + 'px';
        top.style.width = 25 * width + 6 + 'px';
        board.style.width = 25 * width + 'px';
        board.style.height = 25 * height + 'px';
        board.innerHTML = '';
        boardArray = [];
        bombArray = [];
        cells = [];
        clearInterval(timerInterval);
        createBoard();
    });
});
