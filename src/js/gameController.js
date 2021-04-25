// Make initial render of the box
(function makeInitialBox() {
    gameBox.forEach(row => {
        const newRow = document.createElement('div');
        newRow.className = 'row';
        row.forEach(el => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (el === 1) {
                cell.className += ' snakeCell';
            } else if (el === 2) {
                cell.className += ' newCell';
            } else {
                cell.className += ' emptyCell';
            }

            newRow.append(cell);
        });

        MAIN_CONTAINER.append(newRow);
    });
})();

function render() {
    const firstCell = snake[0];
    const rows = Array.from(MAIN_CONTAINER.children);
    const firstCells = Array.from(rows[firstCell.y].children);
    firstCells[firstCell.x].className = 'cell snakeCell';
    const oldCells = Array.from(rows[oldCell.y].children);
    oldCells[oldCell.x].className = 'cell emptyCell';
}

document.body.addEventListener('keydown', (e) => {
    if (isGameOver) {
        return;
    }

    if (e.key === 'ArrowUp') {
        move('up');
        render();
    } else if (e.key === 'ArrowRight') {
        move('right');
        render();
    } else if (e.key === 'ArrowDown') {
        move('down');
        render();
    } else if (e.key === 'ArrowLeft') {
        move('left');
        render();
    }
});