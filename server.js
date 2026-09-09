const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.static("public"));

const rooms = new Map();

let onlinePlayers = 0;

const GAME_TIME = 60;

function createRoomCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";

    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }

    if (rooms.has(code)) {
        return createRoomCode();
    }

    return code;
}

function createRoom(socket) {

    const code = createRoomCode();

    const room = {

        code,

        player1: socket.id,
        player2: null,

        ready1: false,
        ready2: false,

        board: ["", "", "", "", "", "", "", ""],

        currentPlayer: 1,

        score1: 0,
        score2: 0,
        draws: 0,

        gameStarted: false,

        timeLeft: GAME_TIME,

        timer: null
    };

    rooms.set(code, room);

    socket.join(code);

    socket.roomCode = code;
    socket.playerNumber = 1;

    return room;
}

function getRoom(socket) {

    if (!socket.roomCode) {
        return null;
    }

    return rooms.get(socket.roomCode);
}

function sendRoomState(room) {

    io.to(room.code).emit("roomState", {

        player1: !!room.player1,

        player2: !!room.player2,

        ready1: room.ready1,

        ready2: room.ready2,

        board: room.board,

        currentPlayer: room.currentPlayer,

        score1: room.score1,

        score2: room.score2,

        draws: room.draws,

        gameStarted: room.gameStarted,

        timeLeft: room.timeLeft
    });
}

function checkWinner(board) {

    const patterns = [

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const pattern of patterns) {

        const a = pattern[0];
        const b = pattern[1];
        const c = pattern[2];

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return board[a];
        }
    }

    if (board.every(cell => cell !== "")) {
        return "DRAW";
    }

    return null;
}

function startGame(room) {

    room.board = ["", "", "", "", "", "", "", ""];

    room.currentPlayer = 1;

    room.gameStarted = true;

    room.timeLeft = GAME_TIME;

    sendRoomState(room);

    if (room.timer) {
        clearInterval(room.timer);
    }

    room.timer = setInterval(() => {

        if (!room.gameStarted) {
            return;
        }

        room.timeLeft--;

        io.to(room.code).emit(
            "timer",
            room.timeLeft
        );

        if (room.timeLeft <= 0) {

            room.gameStarted = false;

            room.draws++;

            clearInterval(room.timer);

            room.timer = null;

            io.to(room.code).emit(
                "result",
                {
                    winner: "DRAW",
                    message: "Time is over! It's a draw!"
                }
            );

            sendRoomState(room);
        }

    }, 1000);
}

function endGame(room, winner) {

    room.gameStarted = false;

    if (room.timer) {

        clearInterval(room.timer);

        room.timer = null;
    }

    if (winner === "X") {

        room.score1++;

    } else if (winner === "O") {

        room.score2++;

    } else {

        room.draws++;
    }

    let message;

    if (winner === "X") {

        message = "Player 1 Wins!";

    } else if (winner === "O") {

        message = "Player 2 Wins!";

    } else {

        message = "It's a Draw!";
    }

    io.to(room.code).emit(
        "result",
        {
            winner,
            message
        }
    );

    sendRoomState(room);
}

io.on("connection", socket => {

    onlinePlayers++;

    io.emit(
        "onlinePlayers",
        onlinePlayers
    );

    console.log(
        "Connected:",
        socket.id
    );

    socket.on("createRoom", () => {

        if (socket.roomCode) {
            return;
        }

        const room = createRoom(socket);

        socket.emit(
            "roomCreated",
            {
                code: room.code,
                player: 1
            }
        );

        sendRoomState(room);
    });

    socket.on("joinRoom", code => {

        code = String(code)
            .trim()
            .toUpperCase();

        const room = rooms.get(code);

        if (!room) {

            socket.emit(
                "errorMessage",
                "Room not found!"
            );

            return;
        }

        if (room.player2) {

            socket.emit(
                "errorMessage",
                "Room is already full!"
            );

            return;
        }

        room.player2 = socket.id;

        socket.join(code);

        socket.roomCode = code;

        socket.playerNumber = 2;

        socket.emit(
            "roomJoined",
            {
                code,
                player: 2
            }
        );

        io.to(code).emit(
            "opponentJoined"
        );

        sendRoomState(room);
    });

    socket.on("ready", () => {

        const room = getRoom(socket);

        if (!room) {
            return;
        }

        if (socket.playerNumber === 1) {

            room.ready1 = true;

        } else {

            room.ready2 = true;
        }

        sendRoomState(room);

        if (
            room.ready1 &&
            room.ready2 &&
            room.player1 &&
            room.player2
        ) {

            startGame(room);
        }
    });

    socket.on("move", index => {

        const room = getRoom(socket);

        if (!room) {
            return;
        }

        if (!room.gameStarted) {
            return;
        }

        const player =
            socket.playerNumber;

        if (player !== room.currentPlayer) {
            return;
        }

        if (
            index < 0 ||
            index > 8 ||
            room.board[index] !== ""
        ) {
            return;
        }

        const symbol =
            player === 1 ? "X" : "O";

        room.board[index] = symbol;

        const winner =
            checkWinner(room.board);

        if (winner) {

            sendRoomState(room);

            endGame(room, winner);

            return;
        }

        room.currentPlayer =
            player === 1 ? 2 : 1;

        sendRoomState(room);
    });

    socket.on("rematch", () => {

        const room = getRoom(socket);

        if (!room) {
            return;
        }

        if (socket.playerNumber === 1) {

            room.ready1 = true;

        } else {

            room.ready2 = true;
        }

        io.to(room.code).emit(
            "rematchWaiting"
        );

        if (
            room.ready1 &&
            room.ready2
        ) {

            startGame(room);
        }
    });

    socket.on("leaveRoom", () => {

        leaveRoom(socket);
    });

    socket.on("disconnect", () => {

        onlinePlayers--;

        if (onlinePlayers < 0) {
            onlinePlayers = 0;
        }

        io.emit(
            "onlinePlayers",
            onlinePlayers
        );

        leaveRoom(socket);
    });
});

function leaveRoom(socket) {

    const code = socket.roomCode;

    if (!code) {
        return;
    }

    const room = rooms.get(code);

    if (!room) {
        return;
    }

    if (room.timer) {

        clearInterval(room.timer);

        room.timer = null;
    }

    if (socket.playerNumber === 1) {

        if (room.player2) {

            io.to(room.player2).emit(
                "opponentLeft"
            );
        }

        rooms.delete(code);

    } else {

        room.player2 = null;

        room.ready2 = false;

        room.gameStarted = false;

        if (room.player1) {

            io.to(room.player1).emit(
                "opponentLeft"
            );
        }

        sendRoomState(room);
    }

    socket.leave(code);

    socket.roomCode = null;

    socket.playerNumber = null;
}

server.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );
});