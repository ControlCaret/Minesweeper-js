document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const flagsLeft = document.querySelector('#flags-left');
    const timer = document.querySelector('#timer');
    const emojiBtn = document.querySelector('.emoji-btn');

    let width = 10;
    let bombAmount = 5;
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    let time = 0;

    function createBoard() {
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('normal');
        const tempArray = emptyArray.concat(bombsArray);
        const shuffledArray = tempArray.sort(() => Math.random() - 0.5);

        let cells = [];

        for (let i = 0; i < width * width; i++) {
            const cell = document.createElement('cell');
            cell.setAttribute('id', i);
            cell.classList.add(shuffledArray[i]);
            board.appendChild(cell);
            cells.push(cell);
        }

        for (let i = 0; i < cells.length; i++) {
            let bombCount = 0;

            if (cells[i].classList.contains('normal')) {
                for (let y = -1; y <= 1; y++) {
                    for (let x = -1; x <= 1; x++) {
                        const cell = cells[i + x + y * width];
                        if (cell && cell.classList.contains('bomb')) {
                            bombCount++;
                        }
                    }
                }
            }
            cells[i].setAttribute('data', bombCount);
            cells[i].innerHTML = bombCount;
        }
    }
    createBoard();
});