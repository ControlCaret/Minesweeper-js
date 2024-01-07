document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let cells = [];
    let isGameOver = false;

    // create Board
    function createBoard() {
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('normal');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('id', i);
            cell.classList.add(shuffledArray[i]);
            grid.appendChild(cell);
            cells.push(cell);

            // left click
            cell.addEventListener('click', function (e) {
                //click(cell);
            });

            // right click
            cell.oncontextmenu = function (e) {
                e.preventDefault();
                //addFlag(cell);
            }

            for (let i = 0; i < cells.length; i++) {
                let total = 0;
                const isLeftEdge = (i % width === 0);
                const isRightEdge = (i % width === width - 1);

                if (cells[i].classList.contains('cell', 'normal')) {
                    if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains('bomb')) total++;
                    if (i > 9 && !isRightEdge && cells[i + 1 - width].classList.contains('bomb')) total++;
                    if (i > 10 && cells[i - width].classList.contains('bomb')) total++;
                    if (i > 11 && !isLeftEdge && cells[i - 1 - width].classList.contains('bomb')) total++;
                    if (i < 98 && !isRightEdge && cells[i + 1].classList.contains('bomb')) total++;
                    if (i < 90 && !isLeftEdge && cells[i - 1 + width].classList.contains('bomb')) total++;
                    if (i < 88 && !isRightEdge && cells[i + 1 + width].classList.contains('bomb')) total++;
                    if (i < 89 && cells[i + width].classList.contains('bomb')) total++;
                    cells[i].setAttribute('data', total);
                }
            }
        }
    }
    createBoard();
});