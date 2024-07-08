// user objects loaded from storage
let user = JSON.parse(sessionStorage.getItem("user")) || [];
let cpu = JSON.parse(sessionStorage.getItem("computer")) || [];

// saves gameData
let saveData;
let arr;

// set score area text and color
if (user[2] === 'playerO') {
    document.getElementById('you').innerHTML = 'O (YOU)';
    document.getElementById('you-rg').style.backgroundColor = user[1];
    document.getElementById('cpu').innerHTML = 'X (CPU)';
    document.getElementById('cpu-rg').style.backgroundColor = cpu[1];
}

// turn icon functions
let turnIcon = document.getElementById('turn-icon-img');

const changeToUser = () => {
    turnIcon.src = user[3];
}

const changeToCpu = () => {
    turnIcon.src = cpu[3];
}

let userScore = Number(document.getElementById('player-score').innerHTML);
let tiesCount = Number(document.getElementById('ties-count').innerHTML);
let cpuScore = Number(document.getElementById('cpu-score').innerHTML);
let restartBtn = document.getElementById('restart-icon');
let confirmRestart = document.getElementById('restart');
let overlay = document.getElementById('overlay');
let cancelBtn = document.getElementById('cancel');
const boxes = document.querySelectorAll(".box");
let boxArr = Array.from(boxes);
const nextRound = document.getElementById('next-round');

// trackers
let gamesLeft = 1;
let turn = user[2] === 'playerX';

// BROWSER RELOAD SAVE FUNCTIONALITY START
const classes = () => {
    arr = [];
    boxArr.forEach(box => {
        if (box.classList.contains('playerX')){
            arr.push('playerX');
        } else if (box.classList.contains('playerO')){
            arr.push('playerO');
        } else {
            arr.push('a');
        }
    });
};

function saveGameState () {
    classes();
    saveData = {
        userScore,
        turn,
        tiesCount,
        cpuScore,
        arr
    };
    sessionStorage.setItem("gameData", JSON.stringify(saveData));
    console.log('saved game state');
}

function restoreGameState() {
    console.log('called restoreGamestate');
    saveData = JSON.parse(sessionStorage.getItem("gameData"));
    console.log(saveData);

    turn = saveData.turn;
    userScore = saveData.userScore;
    tiesCount = saveData.tiesCount;
    cpuScore = saveData.cpuScore;
    arr = saveData.arr;

    boxArr.forEach((box, index) => {
        box.classList.add(arr[index]);
        if (arr[index] === 'playerX') {
            box.textContent = 'X';
            box.style.color = user[2] === 'playerX' ? user[1] : cpu[1];
        } else if (arr[index] === 'playerO') {
            box.textContent = 'O';
            box.style.color = user[2] === 'playerO' ? user[1] : cpu[1];
        }
        box.style.fontSize = '64px';
        box.style.display = 'flex';
        box.style.justifyContent = 'center';
        box.style.alignItems = 'center';
    });

    document.getElementById('cpu-score').innerHTML = cpuScore.toString();
    document.getElementById('player-score').innerHTML = userScore.toString();
    document.getElementById('ties-count').innerHTML = tiesCount.toString();

    if (turn) {
        console.log(turn);
        gameplay();
    } else {
        turn = true;
        gameplay();
        turn = !turn;
    }
}
// BROWSER END

// get empty boxes
const getEmpty = () => {
    return boxArr.filter(cell => 
        !cell.classList.contains(user[2]) && !cell.classList.contains(cpu[2])
    );  
}

// WIN, LOSE AND TIED STATE
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

// check win
const checkWin = (mark) => {
    return WIN_COMBOS.some((combo) => {
        return combo.every((element) => {
            let condition = boxArr[element].classList.contains(mark);
            return condition;
        })
    })
}

// check if gameboard is full
const boardFull = () => {
    return boxArr.every((val) => 
    val.classList.contains(user[2]) || val.classList.contains(cpu[2]))
}

// brings up restart state
const restartState = () => {
    document.getElementById('restart-ttr').innerHTML = 'RESTART GAME?';
    document.getElementById('restart-ttr').style.color = '#A8BFC9';
    document.getElementById('restart-states').style.visibility = 'visible';
    overlay.style.visibility = 'visible';
}

restartBtn.addEventListener('click', restartState);

// restart game
confirmRestart.addEventListener('click', () => {
    clrScreen();
    saveGameState();
    gamesLeft++;
    gameplay();
});

// removes restart state
cancelBtn.addEventListener('click', () => {
    document.getElementById('restart-states').style.visibility = 'hidden'; 
    overlay.style.visibility = 'hidden';
});

// brings up tied State
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

// clears screen
const clrScreen = () => boxArr.forEach((item) => {
    item.classList.remove(user[2]);
    item.classList.remove(cpu[2]);
    item.textContent = ''; // Effacez le texte
    document.getElementById('states').style.visibility = 'hidden';
    document.getElementById('restart-states').style.visibility = 'hidden';
    overlay.style.visibility = 'hidden';
    item.addEventListener('mouseenter', () => hover(item));
    item.style.backgroundColor = '#1F3641';
    item.style.color = ''; // Réinitialisez la couleur du texte
    item.style.fontSize = ''; // Réinitialisez la taille de la police
    item.style.display = ''; // Réinitialisez le display
});

// setting hovers
const hover = (item) => {
    if (!item.textContent) {
        item.textContent = user[2] === 'playerX' ? 'X' : 'O';
        item.style.color = 'rgba(168, 191, 201, 0.5)'; // Couleur semi-transparente pour l'effet de survol
        item.style.fontSize = '64px';
        item.style.display = 'flex';
        item.style.justifyContent = 'center';
        item.style.alignItems = 'center';
    }
}

const setHover = () => {
    getEmpty().forEach(cell => {
        cell.addEventListener('mouseenter', () => hover(cell));
        cell.addEventListener('mouseleave', () => {
            if (!cell.classList.contains(user[2]) && !cell.classList.contains(cpu[2])) {
                cell.textContent = '';
                cell.style.color = '';
                cell.style.fontSize = '';
                cell.style.display = '';
            }
        });
    });
}

// create highlight on win icons
const winEffect = (caller) => {
    const winArr = [];
    boxArr.forEach(box => {
        if (box.classList.contains(caller[2])){
            winArr.push(Number(box.id));
        }
    });
    WIN_COMBOS.forEach(combo => {
        if (combo.every(e => winArr.includes(e))) {
            combo.forEach(item => {
                boxArr[item].style.backgroundColor = caller[1];
                boxArr[item].style.color = '#1F3641'; // Changez la couleur du texte pour contraster
            });
        }
    });

    // Crée une image pour l'icône du gagnant
    const winIcon = document.getElementById('win-icon');
    winIcon.innerHTML = ''; // Vide le contenu précédent

    // Crée une nouvelle balise <img>
    const img = document.createElement('img');
    img.src = caller[0]; // Assure-toi que cette URL est correcte
    img.alt = 'winner icon';
    img.style.width = '50px';
    img.style.height = '50px';
    winIcon.appendChild(img);

    // Mets à jour le texte et le style pour le message de victoire
    document.getElementById('state-text').innerHTML = 'WINNER!';
    document.getElementById('ttr').innerHTML = 'TAKES THIS ROUND';
    document.getElementById('ttr').style.color = caller[1];
    document.getElementById('states-message').style.columnGap = '24px';
    document.getElementById('states').style.visibility = 'visible';
    overlay.style.visibility = 'visible';
}

// CPU Starts
const player = Players();

// return computer choice
function Players () {
    const machine = () => {          
        let play = Math.floor(Math.random() * boxArr.length);
        while(boxArr[play].classList.contains(user[2]) || boxArr[play].classList.contains(cpu[2])){
            play = Math.floor(Math.random() * boxArr.length);
        }
        boxArr[play].classList.add(cpu[2]);
        boxArr[play].textContent = cpu[2] === 'playerX' ? 'X' : 'O';
        boxArr[play].style.color = cpu[1]; // Utilisez la couleur du CPU
        boxArr[play].style.fontSize = '64px';
        boxArr[play].style.display = 'flex';
        boxArr[play].style.justifyContent = 'center';
        boxArr[play].style.alignItems = 'center';
        boxArr[play].classList.add(cpu[2]);

        if (checkWin(cpu[2])){
            winEffect(cpu);
            cpuScore += 1;
            document.getElementById('cpu-score').innerHTML = cpuScore.toString();
            saveGameState();
            return;
        }

        if (boardFull() && !checkWin(user[2]) && !checkWin(cpu[2])) {
            tiedState();
            return;
        }
        
        saveGameState();
    }
    return {machine};
} 

function cpuChoice () {
    return new Promise((resolve) => {
        setTimeout(() => {
            player.machine();
            resolve();
        }, 900);
    });
}
// CPU ends

// checks if user has won
const checkUserWin = () => {
    if (checkWin(user[2])){
        winEffect(user);
        userScore += 1;
        saveGameState();
        document.getElementById('player-score').innerHTML = userScore.toString();
        return true;
    } else {
        return false;
    }
}

// removes hover on clicked box
function remove (evt) {
    evt.target.style.backgroundImage = '';
}

// USER starts
function userChoice (evt) {
    if (!evt.target.classList.contains(cpu[2])) {
        evt.target.classList.add(user[2]);
        changeToCpu();
    } else {
        return;
    }
    evt.target.addEventListener('mouseenter', remove);
    evt.target.removeEventListener('click', userChoice);
    if (checkUserWin()) {
        return;
    }
    if (boardFull() && !checkWin(user[2]) && !checkWin(cpu[2])) {
        tiedState();
        return;
    }
    saveGameState();
    cpuChoice().then(() => changeToUser());
}

// player object
const play = {
    cells: getEmpty(),
    addEvt () {
        this.cells.forEach(cell => {
            cell.addEventListener('click', userChoice);
        });
    },
    rmEvt () {
        this.cells.forEach(cell => {
            cell.removeEventListener('click', userChoice);
        });
    }
}

// calls next round
nextRound.addEventListener('click', () => {
    gamesLeft += 1;
    turn = !turn;
    clrScreen();
    saveGameState();
    gameplay();
});

// game play
const gameplay = () => {
    setHover();
    if (turn) {
        changeToUser();
        play.addEvt();
    } else {
        cpuChoice().then(() => {
            changeToUser();
            play.addEvt();
        });
    }
}

// Restore game state and start gameplay if there is saved data
if (sessionStorage.getItem("gameData") !== null){
    restoreGameState();
} else {
    gameplay();
}
