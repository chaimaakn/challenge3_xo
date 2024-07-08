const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 5000;
const ConnectDb = require("./database/main.js");
const infoRouter = require("./routes/info.js");

app.use(express.json());
app.use(cors());

app.use(express.static(path.resolve("")));

let waitingPlayer = null;
let games = {};

io.on("connection", (socket) => {
    console.log('New client connected', socket.id);

    socket.on('findOpponent', () => {
        console.log('Player looking for opponent', socket.id);
        if (waitingPlayer) {
            // Match found
            const gameId = Math.random().toString(36).substring(7);
            games[gameId] = {
                players: [waitingPlayer, socket.id],
                board: Array(9).fill(null),
                currentPlayer: 'X'
            };
            
            io.to(waitingPlayer).emit('gameStart', { gameId, symbol: 'X' });
            io.to(socket.id).emit('gameStart', { gameId, symbol: 'O' });
            
            waitingPlayer = null;
        } else {
            waitingPlayer = socket.id;
        }
    });

    socket.on('playerMove', (data) => {
        const { gameId, index, symbol } = data;
        console.log('Player move', gameId, index, symbol);
        
        if (games[gameId] && games[gameId].currentPlayer === symbol) {
            games[gameId].board[index] = symbol;
            games[gameId].currentPlayer = symbol === 'X' ? 'O' : 'X';
            
            io.to(games[gameId].players[0]).emit('gameUpdate', games[gameId]);
            io.to(games[gameId].players[1]).emit('gameUpdate', games[gameId]);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        if (waitingPlayer === socket.id) {
            waitingPlayer = null;
        }
        // Handle game disconnection
        for (let gameId in games) {
            if (games[gameId].players.includes(socket.id)) {
                const otherPlayer = games[gameId].players.find(id => id !== socket.id);
                io.to(otherPlayer).emit('opponentDisconnected');
                delete games[gameId];
                break;
            }
        }
    });
});

app.get("/hollowdev", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.use("/hollowdev/user", require("./routes/Route2.js"));
app.use("/hollowdev/game", require("./routes/Routegame.js"));
app.use("/info", infoRouter);

async function start() {
    try {
        await ConnectDb(process.env.DATABASE_URL);
        server.listen(port, () => {
            console.log('Server is running on port ' + port);
        });
    } catch (error) {
        console.log("An error occurred", error);
    }
}

start();