document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const flagsLeft = document.querySelector('#flags-left');
    const timer = document.querySelector('#timer');
    const emojiBtn = document.querySelector('.emoji-btn');

    let width = 10;
    let bombAmount = 10;
    let flags = 0;
    let cells = [];
    let isGameOver = false;
    let time = 0;

    function createBoard() {
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('normal');
        const tempArray = emptyArray.concat(bombsArray);
        const shuffledArray = tempArray.sort(() => Math.random() - 0.5);

        emojiBtn.innerHTML = '🙂';
        flagsLeft.innerHTML = bombAmount;

        for (let i = 0; i < width * width; i++) {
            const cell = document.createElement('cell');
            cell.setAttribute('id', i);
            cell.classList.add(shuffledArray[i]);
            board.appendChild(cell);
            cells.push(cell);

            cell.addEventListener('click', function (e) {
                click(cell);
            });

            cell.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(cell);
            }
        }

        for (let i = 0; i < cells.length; i++) {
            let bombCount = 0;

            if (cells[i].classList.contains('normal')) {
                for (let y = -1; y <= 1; y++) {
                    for (let x = -1; x <= 1; x++) {
                        const tcell = cells[i + x + y * width];
                        if (tcell && tcell.classList.contains('bomb')) {
                            bombCount++;
                        }
                    }
                }
            } else {
                cells[i].setAttribute('data', -1);
            }
            cells[i].setAttribute('data', bombCount);
        }
    }
    createBoard();

    function click(cell) {
        let currenCell = cell.id;

        if (isGameOver)
            return;
        if (cell.classList.contains('clicked') || cell.classList.contains('flag'))
            return;
        if (cell.classList.contains('bomb'))
            gameOver();
        else {
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
        setTimeout(() => {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let y = parseInt(currentCell / width);
                    let x = parseInt(currentCell % width);
                    if (x + j >= 0 && x + j < width && y + i >= 0 && y + i < width) {
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
        if (!cell.classList.contains('clicked') && (flags < bombAmount)) {
            if (!cell.classList.contains('flag')) {
                cell.classList.add('flag');
                cell.innerHTML = '🚩';
                flags++;
                flagsLeft.innerHTML = bombAmount - flags;
                checkWin();
            } else {
                cell.classList.remove('flag');
                cell.innerHTML = '';
                flags--;
                flagsLeft.innerHTML = bombAmount - flags;
            }
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
            if (cell.classList.contains('bomb')) {
                cell.innerHTML = '💣';
            }
        });
    }

    emojiBtn.addEventListener('click', () => {
        location.reload();
    });
});