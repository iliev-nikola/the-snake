const settings = {
    height: 45,
    width: 30,
    speed: 150,
    isGameOver: false,
}

let timer;
const gameBox = [];
let lastDirection;

for (let i = 0; i < settings.height; i++) {
    const arr = new Array(settings.width).fill(0);
    gameBox.push(arr);
}

gameBox[14][10] = 1;
gameBox[14][11] = 1;
gameBox[14][12] = 1;
let snake = [{ x: 10, y: 14 }, { x: 11, y: 14 }, { x: 12, y: 14 }];
placeRandomDot('initial');
let oldCell;

function move(direction) {
    const newCell = {};
    const { x, y } = snake[0];
    // change coordinates by the new direction
    if (direction === 'up') {
        newCell.x = x;
        newCell.y = y - 1;
    } else if (direction === 'right') {
        newCell.x = x + 1;
        newCell.y = y;
    } else if (direction === 'down') {
        newCell.x = x;
        newCell.y = y + 1;
    } else {
        newCell.x = x - 1;
        newCell.y = y;
    }

    // if reach any border
    if (newCell.x < 0) {
        newCell.x = settings.width - 1;
    } else if (newCell.x > settings.width - 1) {
        newCell.x = 0;
    } else if (newCell.y < 0) {
        newCell.y = settings.height - 1;
    } else if (newCell.y > settings.height - 1) {
        newCell.y = 0;
    }

    snake.unshift(newCell);
    // check what next cell contains
    if (gameBox[newCell.y][newCell.x] === 0) {
        oldCell = snake.pop();
        gameBox[newCell.y][newCell.x] = 1;
        const lastCell = snake[snake.length - 1];
        gameBox[lastCell.y][lastCell.x] = 0;
    } else if (gameBox[newCell.y][newCell.x] === 1) {
        settings.isGameOver = true;
        clearInterval(timer);
        GAME_OVER_SCREEN.style.display = 'flex';
        return console.log('game over');
    } else {
        placeRandomDot();
    }

    lastDirection = direction;
}

function placeRandomDot(type) {
    let randomX = randomize(settings.width);
    let randomY = randomize(settings.height);
    while (gameBox[randomY][randomX] !== 0) {
        randomX = randomize(settings.width);
        randomY = randomize(settings.height);
    }

    gameBox[randomY][randomX] = 2;
    // do that every other time then the initial load of the box
    if (!type) {
        const rows = Array.from(MAIN_CONTAINER.children);
        const cells = Array.from(rows[randomY].children);
        cells[randomX].className = 'cell newCell';
    }
}