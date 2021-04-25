// setup the size of the game over screen
GAME_OVER_SCREEN.style.width = settings.width * 10 + 'px';
GAME_OVER_SCREEN.style.height = settings.height * 10 + 'px';

// Make initial render of the box
function makeInitialBox() {
    // clear the initial data to start from the beginning
    clearInterval(timer);
    settings.isGameOver = false;
    settings.points = 0;
    settings.speed = 150;
    MAIN_CONTAINER.innerHTML = '';
    GAME_OVER_SCREEN.style.display = 'none';
    CURRENT_SCORE.innerHTML = 0;
    lastDirection = null;
    gameBox = [];
    for (let i = 0; i < settings.height; i++) {
        const arr = new Array(settings.width).fill(0);
        gameBox.push(arr);
    }

    gameBox[middleY][middleX] = 1;
    gameBox[middleY][middleX + 1] = 1;
    gameBox[middleY][middleX + 2] = 1;
    snake = [{ x: middleX, y: middleY }, { x: middleX + 1, y: middleY }, { x: middleX + 2, y: middleY }];
    placeRandomDot('initial');

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
}

makeInitialBox();

function render() {
    const firstCell = snake[0];
    const rows = Array.from(MAIN_CONTAINER.children);
    const firstCells = Array.from(rows[firstCell.y].children);
    firstCells[firstCell.x].className = 'cell snakeCell';
    const oldCells = Array.from(rows[oldCell.y].children);
    oldCells[oldCell.x].className = 'cell emptyCell';
}


document.body.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.key === ' ') {
        return makeInitialBox();
    }

    if (settings.isGameOver) {
        return;
    }

    if (e.key === 'ArrowUp') {
        if (lastDirection === 'up' || lastDirection === 'down') {
            return;
        }

        clearInterval(timer);
        timer = setInterval(() => {
            move('up');
            render();
        }, settings.speed);
    } else if (e.key === 'ArrowRight') {
        if (lastDirection === 'right' || lastDirection === 'left') {
            return;
        } else if (!timer) {
            snake = snake.reverse();
        }

        clearInterval(timer);
        timer = setInterval(() => {
            move('right');
            render();
        }, settings.speed);
    } else if (e.key === 'ArrowDown') {
        if (lastDirection === 'down' || lastDirection === 'up') {
            return;
        }
        clearInterval(timer);
        timer = setInterval(() => {
            move('down');
            render();
        }, settings.speed);
    } else if (e.key === 'ArrowLeft') {
        if (lastDirection === 'left' || lastDirection === 'right') {
            return;
        }
        clearInterval(timer);
        timer = setInterval(() => {
            move('left');
            render();
        }, settings.speed);
    }
});

SPEED_UP.addEventListener('click', (e) => {
    e.preventDefault();
    settings.speed -= 15;
});

SPEED_DOWN.addEventListener('click', (e) => {
    e.preventDefault();
    settings.speed += 15;
});