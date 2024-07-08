const socket = io();  // Initialiser Socket.IO

let p1 = JSON.parse(sessionStorage.getItem("user"));
let p2 = JSON.parse(sessionStorage.getItem("computer"));

// Save game data
let saveData;
let arr; 

// Current player based on the selected starting icon
let currentPlayer;

// Set the current player based on the mark chosen
if (p1[2] === "playerO") {
    currentPlayer = p2;
} else {
    currentPlayer = p1;
}

// Set score area text and color
if (p1[2] === 'playerO') {
    document.getElementById('you').innerHTML = 'O (P1)';
    document.getElementById('p1-rg').style.backgroundColor = p1[1];
    document.getElementById('cpu').innerHTML = 'X (P2)';
    document.getElementById('p2-rg').style.backgroundColor = p2[1];
} else {
    document.getElementById('you').innerHTML = 'X (P1)';
    document.getElementById('p1-rg').style.backgroundColor = p1[1];
    document.getElementById('cpu').innerHTML = 'O (P2)';
    document.getElementById('p2-rg').style.backgroundColor = p2[1];
}

// Turn icon
let turnIcon = document.getElementById('turn-icon-img');

// Changes the turn icon based on the current player
const changeTurnIcon = () => {
    turnIcon.src = currentPlayer[3];
}

let p1Score = Number(document.getElementById('player-score').innerHTML);
let tiesCount = Number(document.getElementById('ties-count').innerHTML);
let p2Score = Number(document.getElementById('cpu-score').innerHTML);
let restartBtn = document.getElementById('restart-icon');
let confirmRestart = document.getElementById('restart');
let overlay = document.getElementById('overlay');
let cancelBtn = document.getElementById('cancel');
const nextRound = document.getElementById('next-round');
const boxArr = Array.from(document.querySelectorAll('.box'));

// Trackers
let gamesLeft = 1;
let turn = p1[2] === 'playerX';

// Save game state
function saveGameState () {
    classes();
    saveData = {
        p1Score,
        turn,
        tiesCount,
        p2Score,
        currentPlayer,
        arr
    };
    sessionStorage.setItem("gameData", JSON.stringify(saveData));
}

// Restore game state
function restoreGameState() {
    saveData = JSON.parse(sessionStorage.getItem("gameData"));
    turn = saveData.turn;
    currentPlayer = saveData.currentPlayer;
    p1Score = saveData.p1Score;
    tiesCount = saveData.tiesCount;
    p2Score = saveData.p2Score;
    boxArr.forEach((box, index) => {
        box.classList.add(saveData.arr[index]);
        if (saveData.arr[index] === 'playerX') {
            box.style.backgroundImage = `url(${p1[3]})`;
        } else if (saveData.arr[index] === 'playerO') {
            box.style.backgroundImage = `url(${p2[3]})`;
        }
        box.style.backgroundRepeat = 'no-repeat';
        box.style.backgroundPosition = 'center';
    });

    document.getElementById('cpu-score').innerHTML = p2Score.toString();
    document.getElementById('player-score').innerHTML = p1Score.toString();
    document.getElementById('ties-count').innerHTML = tiesCount.toString();

    if ((turn === false) && (currentPlayer[2] === p1[2])) {
        turn = true;
        gameplay();
        turn = !turn;
    } else if ((turn === true) && (currentPlayer[2] === p2[2])) {
        turn = false;
        gameplay();
        turn = !turn;
    } else {
        gameplay();
    }
}

// Save the class list for each box
const classes = () => {
    arr = [];
    boxArr.forEach(box => {
        if (box.classList.contains('playerX')) {
            arr.push('playerX');
        } else if (box.classList.contains('playerO')) {
            arr.push('playerO');
        } else {
            arr.push('a');
        }
    });
};

// Get empty boxes
const getEmpty = () => {
    return boxArr.filter(cell => 
        !cell.classList.contains(p1[2]) && !cell.classList.contains(p2[2])
    );  
}

// Win combinations
const WIN_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Check win
const checkWin = (mark) => {
    return WIN_COMBOS.some((combo) => {
        return combo.every((element) => {
            let condition = boxArr[element].classList.contains(mark);
            return condition;
        });
    });
}

// Check if the board is full
const boardFull = () => {
    return boxArr.every((val) => 
        val.classList.contains(p1[2]) || val.classList.contains(p2[2])
    );
}

// Show restart state
const restartState = () => {
    document.getElementById('restart-ttr').innerHTML = 'RESTART GAME?';
    document.getElementById('restart-ttr').style.color = '#A8BFC9';
    document.getElementById('restart-states').style.visibility = 'visible';
    overlay.style.visibility = 'visible';
}

restartBtn.addEventListener('click', restartState);

// Restart game
confirmRestart.addEventListener('click', () => {
    clrScreen();
    saveGameState();
    gamesLeft++;
    gameplay();
    socket.emit('nextRound', {});
});

// Hide restart state
cancelBtn.addEventListener('click', () => {
    document.getElementById('restart-states').style.visibility = 'hidden';
    overlay.style.visibility = 'hidden'; 
});

// Show tie state
const tiedState = () => {
    tiesCount += 1;
    document.getElementById('ties-count').innerHTML = tiesCount.toString();
    document.getElementById('state-text').innerHTML = '';
    document.getElementById('win-icon').innerHTML = '';
    document.getElementById('ttr').innerHTML = 'ROUND TIED';
    document.getElementById('ttr').style.color = '#A8BFC9';
    document.getElementById('states-message').style.columnGap = '0px';
    document.getElementById('states').style.visibility = 'visible';
    overlay.style.visibility = 'visible';
}

// Clear screen
const clrScreen = () => boxArr.forEach((item) => {
    item.classList.remove(p1[2]);
    item.classList.remove(p2[2]);
    item.textContent = ''; 
    item.style.backgroundColor = '#1F3641';
    document.getElementById('states').style.visibility = 'hidden';
    document.getElementById('restart-states').style.visibility = 'hidden';
    overlay.style.visibility = 'hidden';
    item.style.backgroundImage = '';
});

// Set hover effects
const hover = (item) => {
    if (currentPlayer[2] === 'playerO') {
        item.style.backgroundImage = 'url(./assets/icon-o-grey.png)'; 
    } else {
        item.style.backgroundImage = 'url(./assets/icon-x-grey.png)'; 
    }
    item.style.backgroundRepeat = 'no-repeat';
    item.style.backgroundPosition = '50%';
}

const setHover = () => {
    getEmpty().forEach(cell => {
        cell.addEventListener('mouseenter', () => hover(cell));
        cell.addEventListener('mouseleave', () => cell.style.backgroundImage = '');
    });
}

// Create highlight on win icons
const winEffect = (caller) => {
    const winArr = [];
    boxArr.forEach(box => {
        if (box.classList.contains(caller[2])) {
            winArr.push(Number(box.id));
        }
    });
    WIN_COMBOS.forEach(combo => {
        if (combo.every(e => winArr.includes(e))) {
            combo.forEach(item => {
                boxArr[item].classList.add('winner-box');
            });
        }
    });
}

// Check if a box is empty
const isValid = (box) => {
    return !box.classList.contains(p1[2]) && !box.classList.contains(p2[2]);
};

// Update the score
const updateScore = () => {
    if (currentPlayer === p1) {
        p1Score += 1;
    } else {
        p2Score += 1;
    }
}

// Show win state
const statePop = () => {
    if (currentPlayer === p1) {
        document.getElementById('player-score').innerHTML = p1Score.toString();
        document.getElementById('state-text').innerHTML = 'PLAYER 1 WINS!';
        document.getElementById('ttr').innerHTML = 'TAKES THIS ROUND';
        document.getElementById('states-message').style.columnGap = '24px';
        document.getElementById('win-icon').innerHTML = `<img src="${p1[0]}" alt="Player 1 Win Icon">`;
        document.getElementById('ttr').style.color = p1[1];
        document.getElementById('states').style.visibility = 'visible';
        overlay.style.visibility = 'visible';
        socket.emit('gameResult', { winner: 'p1' });
    } else {
        document.getElementById('cpu-score').innerHTML = p2Score.toString();
        document.getElementById('state-text').innerHTML = 'PLAYER 2 WINS!';
        document.getElementById('ttr').innerHTML = 'TAKES THIS ROUND';
        document.getElementById('states-message').style.columnGap = '24px';
        document.getElementById('win-icon').innerHTML = `<img src="${p2[0]}" alt="Player 2 Win Icon">`;
        document.getElementById('ttr').style.color = p2[1];
        document.getElementById('states').style.visibility = 'visible'; 
        overlay.style.visibility = 'visible';  
        socket.emit('gameResult', { winner: 'p2' });
    }
}


// Change the current player
const changePlayer = () => {
    currentPlayer = (currentPlayer === p1) ? p2 : p1;
    return currentPlayer;
}

// Player actions
function action(evt) {
    if (isValid(evt.target) && !boardFull()) {
        evt.target.classList.add(currentPlayer[2]);
        evt.target.textContent = currentPlayer[2] === 'playerX' ? 'X' : 'O';
        evt.target.style.fontSize = '64px';
        evt.target.style.display = 'flex';
        evt.target.style.justifyContent = 'center';
        evt.target.style.alignItems = 'center';
        evt.target.style.color = currentPlayer[1];

        evt.target.removeEventListener('mouseenter', () => hover(evt.target));
        
        // Émission du mouvement au serveur
        socket.emit('playerMove', { 
            id: evt.target.id, 
            mark: currentPlayer[2],
            currentPlayer: currentPlayer
        });

        if (checkWin(currentPlayer[2])) {
            winEffect(currentPlayer);
            updateScore();
            statePop();
            changePlayer();
            changeTurnIcon();
            saveGameState();
            return;
        }
        changePlayer();
        changeTurnIcon();
        saveGameState();
        if (boardFull()) {
            tiedState();
        }
    }
}
socket.on('connect', () => {
    socket.emit('joinGame', {
        gameState: saveData,
        currentPlayer: currentPlayer
    });
});

// Réception de l'état du jeu
socket.on('gameState', (data) => {
    if (data.gameState) {
        saveData = data.gameState;
        currentPlayer = data.currentPlayer;
        restoreGameState();
    }
});

// Call the next round
// Modification du gestionnaire d'événements nextRound
nextRound.addEventListener('click', () => {
    gamesLeft += 1;
    turn = !turn;
    clrScreen();
    saveGameState();
    gameplay();
    socket.emit('nextRound', { turn: turn, currentPlayer: currentPlayer });
});

// Game play function
const gameplay = () => {
    setHover();
    boxArr.forEach((box) => {
        box.removeEventListener('click', action);
    }); 
    if (gamesLeft > 0) {
        if (turn) {
            currentPlayer = p1;
            turnIcon.src = p1[3];
        } else {
            currentPlayer = p2;
            turnIcon.src = p2[3];
        }
        boxArr.forEach((box) => {
            box.addEventListener('click', action);
        }); 
    } 
}

// Gestion des mouvements de l'adversaire
socket.on('opponentMove', (move) => {
    const box = document.getElementById(move.id);
    if (isValid(box)) {
        box.classList.add(move.mark);
        box.textContent = move.mark === 'playerX' ? 'X' : 'O';
        box.style.fontSize = '64px';
        box.style.display = 'flex';
        box.style.justifyContent = 'center';
        box.style.alignItems = 'center';
        box.style.color = move.mark === 'playerX' ? p1[1] : p2[1];

        if (checkWin(move.mark)) {
            winEffect({ 2: move.mark });
            updateScore();
            statePop();
        } else if (boardFull()) {
            tiedState();
        } else {
            changePlayer();
            changeTurnIcon();
        }
    }
});

// Gestion du nouveau tour
socket.on('newRound', (data) => {
    turn = data.turn;
    currentPlayer = data.currentPlayer;
    clrScreen();
    gameplay();
});

// Handle game result
socket.on('gameResult', (data) => {
    if (data.winner === 'p1') {
        p1Score += 1;
        document.getElementById('player-score').innerHTML = p1Score.toString();
    } else if (data.winner === 'p2') {
        p2Score += 1;
        document.getElementById('cpu-score').innerHTML = p2Score.toString();
    }
});

// Start the game
if (sessionStorage.getItem("gameData") !== null) {
    restoreGameState();
} else {
    socket.emit('startGame', { player: p1 });
    gameplay();
}
