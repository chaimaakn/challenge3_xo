const socket = io('http://localhost:5000');

let roomId = 'someUniqueRoomId'; // Vous devrez générer ou obtenir cet ID d'une manière ou d'une autre
let myTurn = false;

socket.emit('joinGame', roomId);

socket.on('waitingForOpponent', () => {
  console.log('Waiting for an opponent...');
});

socket.on('gameStart', (data) => {
  console.log('Game started!');
  myTurn = socket.id === data.turn;
  if (myTurn) {
    console.log("C'est votre tour");
  } else {
    console.log("C'est le tour de l'adversaire");
  }
});

socket.on('opponentMove', (position) => {
  console.log('Opponent moved:', position);
  // Mettez à jour l'interface utilisateur avec le mouvement de l'adversaire
  // Puis, c'est au tour du joueur actuel
  myTurn = true;
});

socket.on('roomFull', () => {
  console.log('Room is full, cannot join');
});

// Quand un joueur fait un mouvement
function makeMove(position) {
  if (myTurn) {
    socket.emit('makeMove', { roomId, position });
    // Mettez à jour l'interface utilisateur avec le mouvement du joueur
    myTurn = false;
  } else {
    console.log("Ce n'est pas votre tour");
  }
}

// Intégrez cette fonction dans votre logique de jeu existante