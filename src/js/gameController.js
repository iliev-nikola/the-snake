// Set user best score
const gameController = (() => {
  if (localStorage.getItem('snake')) {
    const bestScore = utils.getBestScore();
    USER_BEST.innerHTML = bestScore;
    settings.userBest = bestScore;
  } else {
    utils.setBestScore(0);
    USER_BEST.innerHTML = 0;
  }

  // Make initial render of the box
  const makeInitialBox = () => {
    // set points rendering
    if (settings.points > settings.currentBest) {
      settings.currentBest = settings.points;
      CURRENT_BEST.innerHTML = settings.points;
    }

    if (settings.points > settings.userBest) {
      settings.userBest = settings.points;
      utils.setBestScore(settings.points);
      USER_BEST.innerHTML = settings.userBest;
    }
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
    MAIN_CONTAINER.style.opacity = 1;
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
    gameModel.placeRandomDot('initial');
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
  };

  makeInitialBox();

  const render = () => {
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
  };

  const moveUp = () => {
    if (lastDirection === 'up' || lastDirection === 'down') {
      return;
    }

    clearInterval(timer);
    gameModel.move('up');

    if (!settings.isGameOver) {
      render();
      timer = setInterval(() => {
        gameModel.move('up');
        render();
      }, settings.speed);
    }
  };

  const moveRight = () => {
    if (lastDirection === 'right' || lastDirection === 'left') {
      return;
    } else if (!timer) {
      snake = snake.reverse();
    }

    clearInterval(timer);
    gameModel.move('right');

    if (!settings.isGameOver) {
      render();
      timer = setInterval(() => {
        gameModel.move('right');
        render();
      }, settings.speed);
    }
  };

  const moveDown = () => {
    if (lastDirection === 'down' || lastDirection === 'up') {
      return;
    }

    clearInterval(timer);
    gameModel.move('down');

    if (!settings.isGameOver) {
      render();
      timer = setInterval(() => {
        gameModel.move('down');
        render();
      }, settings.speed);
    }
  };

  const moveLeft = () => {
    if (lastDirection === 'left' || lastDirection === 'right') {
      return;
    }

    clearInterval(timer);
    gameModel.move('left');

    if (!settings.isGameOver) {
      render();
      timer = setInterval(() => {
        gameModel.move('left');
        render();
      }, settings.speed);
    }
  };

  // EVENT LISTENERS
  // keys
  document.body.addEventListener('keydown', (e) => {
    e.preventDefault();

    if (e.key === KEYS.space) {
      return makeInitialBox();
    }

    if (e.key === KEYS.up || e.key === KEYS.w) {
      moveUp();
    } else if (e.key === KEYS.right || e.key === KEYS.d) {
      moveRight();
    } else if (e.key === KEYS.down || e.key === KEYS.s) {
      moveDown();
    } else if (e.key === KEYS.left || e.key === KEYS.a) {
      moveLeft();
    }
  });

  const handleTouchStart = (event) => {
    const firstTouch = utils.getTouches(event)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  };

  const handleTouchMove = (event) => {
    if (!xDown || !yDown || settings.isGameOver) {
      return;
    }

    const xUp = event.touches[0].clientX;
    const yUp = event.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        /* left swipe */
        moveLeft();
      } else {
        /* right swipe */
        moveRight();
      }
    } else {
      if (yDiff > 0) {
        /* up swipe */
        moveUp();
      } else {
        /* down swipe */
        moveDown();
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  };

  // touch
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);

  // speed
  SPEED_UP.addEventListener('click', () => {
    settings.speed -= 10;
    settings.speedCounter++;
    SPEED_COUNTER.innerHTML = settings.speedCounter;
  });

  SPEED_DOWN.addEventListener('click', () => {
    settings.speed += 10;
    settings.speedCounter--;
    SPEED_COUNTER.innerHTML = settings.speedCounter;
  });

  // level
  LEVEL.addEventListener('change', makeInitialBox);

  // theme
  THEME.addEventListener('change', makeInitialBox);

  // new game
  NEW_GAME.addEventListener('click', makeInitialBox);
})();