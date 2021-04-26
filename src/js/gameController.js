// Setup the size of the game over screen
GAME_OVER_SCREEN.style.width = settings.width * 10 + 'px';
GAME_OVER_SCREEN.style.height = settings.height * 10 + 'px';

// Make initial render of the box
function makeInitialBox() {
    // clear the initial data to start from the beginning
    clearInterval(timer);
    timer = null;
    settings.isGameOver = false;
    settings.points = 0;
    settings.speed = 150;
    settings.speedCounter = 0;
    MAIN_CONTAINER.innerHTML = '';
    SPEED_COUNTER.innerHTML = settings.speedCounter;
    GAME_OVER_SCREEN.style.display = 'none';
    CURRENT_SCORE.innerHTML = 0;
    lastDirection = null;
    gameBox = [];
    // make the box
    if (LEVEL.value === 'border' || LEVEL.value === 'border-speed') {
        for (let row = 0; row < settings.height; row++) {
            let arr = [];
            if (row === 0 || row === settings.height - 1) {
                arr = new Array(settings.width).fill(1);
            } else {
                for (let col = 0; col < settings.width; col++) {
                    if (col === 0 || col === settings.width - 1) {
                        arr.push(1);
                    } else {
                        arr.push(0);
                    }
                }
            }

            gameBox.push(arr);
        }
    } else {
        for (let i = 0; i < settings.height; i++) {
            const arr = new Array(settings.width).fill(0);
            gameBox.push(arr);
        }
    }
    // place the initial snake
    gameBox[middleY][middleX] = 1;
    gameBox[middleY][middleX + 1] = 1;
    gameBox[middleY][middleX + 2] = 1;
    snake = [{ x: middleX, y: middleY }, { x: middleX + 1, y: middleY }, { x: middleX + 2, y: middleY }];
    placeRandomDot('initial');
    // render the box
    gameBox.forEach(row => {
        const newRow = document.createElement('div');
        newRow.className = 'row';
        row.forEach(el => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (el === 1) {
                if (THEME.value === 'light') {
                    cell.className += ' snake-cell-light';
                } else {
                    cell.className += ' snake-cell';
                }
            } else if (el === 2) {
                cell.className += ' new-cell';
            } else {
                if (THEME.value === 'pixelized') {
                    cell.className += ' empty-cell-pixelized';
                } else if (THEME.value === 'light') {
                    cell.className += ' empty-cell-light';
                } else {
                    cell.className += ' empty-cell';
                }
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
    const oldCells = Array.from(rows[oldCell.y].children);
    if (THEME.value === 'pixelized') {
        firstCells[firstCell.x].className = 'cell snake-cell';
        oldCells[oldCell.x].className = 'cell empty-cell-pixelized';
    } else if (THEME.value === 'light') {
        firstCells[firstCell.x].className = 'cell snake-cell-light';
        oldCells[oldCell.x].className = 'cell empty-cell-light';
    } else {
        firstCells[firstCell.x].className = 'cell snake-cell';
        oldCells[oldCell.x].className = 'cell empty-cell';
    }
}

// EVENT LISTENERS
// keys
document.body.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.key === ' ') {
        if (settings.points > settings.currentBest) {
            settings.currentBest = settings.points;
            CURRENT_BEST.innerHTML = settings.points;
        }

        if (settings.points > settings.userBest) {
            settings.userBest = settings.points;
            localStorage.setItem('snake', JSON.stringify({ bestScore: settings.points }));
            USER_BEST.innerHTML = settings.userBest;
        }

        return makeInitialBox();
    }

    if (e.key === 'ArrowUp' || e.key === 'w') {
        if (lastDirection === 'up' || lastDirection === 'down') {
            return;
        }
        clearInterval(timer);
        move('up');
        if (!settings.isGameOver) {
            render();
            timer = setInterval(() => {
                move('up');
                render();
            }, settings.speed);
        }
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        if (lastDirection === 'right' || lastDirection === 'left') {
            return;
        } else if (!timer) {
            snake = snake.reverse();
        }
        clearInterval(timer);
        move('right');
        if (!settings.isGameOver) {
            render();
            timer = setInterval(() => {
                move('right');
                render();
            }, settings.speed);
        }
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        if (lastDirection === 'down' || lastDirection === 'up') {
            return;
        }
        clearInterval(timer);
        move('down');
        if (!settings.isGameOver) {
            render();
            timer = setInterval(() => {
                move('down');
                render();
            }, settings.speed);
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        if (lastDirection === 'left' || lastDirection === 'right') {
            return;
        }
        clearInterval(timer);
        move('left');
        if (!settings.isGameOver) {
            render();
            timer = setInterval(() => {
                move('left');
                render();
            }, settings.speed);
        }
    }
});

// speed
SPEED_UP.addEventListener('click', () => {
    settings.speed -= 15;
    settings.speedCounter++;
    SPEED_COUNTER.innerHTML = settings.speedCounter;
});

SPEED_DOWN.addEventListener('click', () => {
    settings.speed += 15;
    settings.speedCounter--;
    SPEED_COUNTER.innerHTML = settings.speedCounter;
});

// level
LEVEL.addEventListener('change', () => {
    makeInitialBox();
});

// theme
THEME.addEventListener('change', () => {
    makeInitialBox();
});