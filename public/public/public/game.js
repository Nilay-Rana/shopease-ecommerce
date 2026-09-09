const socket = io();

const homeScreen =
    document.getElementById("homeScreen");

const roomScreen =
    document.getElementById("roomScreen");

const gameScreen =
    document.getElementById("gameScreen");

const createRoomBtn =
    document.getElementById("createRoomBtn");

const joinRoomBtn =
    document.getElementById("joinRoomBtn");

const roomInput =
    document.getElementById("roomInput");

const homeMessage =
    document.getElementById("homeMessage");

const roomCode =
    document.getElementById("roomCode");

const roomStatus =
    document.getElementById("roomStatus");

const readyBtn =
    document.getElementById("readyBtn");

const leaveRoomBtn =
    document.getElementById("leaveRoomBtn");

const gameLeaveBtn =
    document.getElementById("gameLeaveBtn");

const copyRoomBtn =
    document.getElementById("copyRoomBtn");

const boardCells =
    document.querySelectorAll(".cell");

const turnText =
    document.getElementById("turnText");

const timer =
    document.getElementById("timer");

const gameScore1 =
    document.getElementById("gameScore1");

const gameScore2 =
    document.getElementById("gameScore2");

const draws =
    document.getElementById("draws");

const yourScore =
    document.getElementById("yourScore");

const opponentScore =
    document.getElementById("opponentScore");

const onlinePlayers =
    document.getElementById("onlinePlayers");

const resultBox =
    document.getElementById("resultBox");

const resultText =
    document.getElementById("resultText");

const resultDescription =
    document.getElementById("resultDescription");

const resultIcon =
    document.getElementById("resultIcon");

const rematchBtn =
    document.getElementById("rematchBtn");

const resultLeaveBtn =
    document.getElementById("resultLeaveBtn");

const player1Status =
    document.getElementById("player1Status");

const player2Status =
    document.getElementById("player2Status");


let myPlayer = 0;

let currentBoard =
    ["", "", "", "", "", "", "", ""];

let currentTurn = 1;

let gameRunning = false;


function showScreen(screen) {

    homeScreen.classList.add("hidden");

    roomScreen.classList.add("hidden");

    gameScreen.classList.add("hidden");

    screen.classList.remove("hidden");
}


function showHome() {

    showScreen(homeScreen);

    resultBox.classList.add("hidden");

    roomInput.value = "";

    homeMessage.textContent = "";

    myPlayer = 0;

    gameRunning = false;
}


function showRoom() {

    showScreen(roomScreen);
}


function showGame() {

    showScreen(gameScreen);
}


createRoomBtn.addEventListener(
    "click",
    () => {

        socket.emit("createRoom");

    }
);


joinRoomBtn.addEventListener(
    "click",
    () => {

        const code =
            roomInput.value
                .trim()
                .toUpperCase();

        if (!code) {

            homeMessage.textContent =
                "Please enter a room code.";

            return;
        }

        socket.emit(
            "joinRoom",
            code
        );

    }
);


roomInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            joinRoomBtn.click();

        }

    }
);


readyBtn.addEventListener(
    "click",
    () => {

        readyBtn.disabled = true;

        readyBtn.textContent =
            "✓ Ready!";

        socket.emit("ready");

    }
);


copyRoomBtn.addEventListener(
    "click",
    async () => {

        const code =
            roomCode.textContent;

        try {

            await navigator.clipboard.writeText(code);

            copyRoomBtn.textContent =
                "✓ Copied!";

            setTimeout(() => {

                copyRoomBtn.textContent =
                    "📋 Copy Code";

            }, 1500);

        } catch {

            alert(
                "Room Code: " + code
            );

        }

    }
);


leaveRoomBtn.addEventListener(
    "click",
    () => {

        socket.emit("leaveRoom");

        showHome();

    }
);


gameLeaveBtn.addEventListener(
    "click",
    () => {

        socket.emit("leaveRoom");

        showHome();

    }
);


resultLeaveBtn.addEventListener(
    "click",
    () => {

        socket.emit("leaveRoom");

        showHome();

    }
);


rematchBtn.addEventListener(
    "click",
    () => {

        rematchBtn.disabled = true;

        rematchBtn.textContent =
            "Waiting...";

        socket.emit("rematch");

    }
);


boardCells.forEach(cell => {

    cell.addEventListener(
        "click",
        () => {

            const index =
                Number(
                    cell.dataset.index
                );

            if (!gameRunning) {
                return;
            }

            if (currentTurn !== myPlayer) {
                return;
            }

            if (currentBoard[index] !== "") {
                return;
            }

            socket.emit(
                "move",
                index
            );

        }
    );

});


socket.on(
    "onlinePlayers",
    count => {

        onlinePlayers.textContent =
            count;

    }
);


socket.on(
    "roomCreated",
    data => {

        myPlayer =
            data.player;

        roomCode.textContent =
            data.code;

        roomStatus.textContent =
            "Waiting for opponent...";

        showRoom();

    }
);


socket.on(
    "roomJoined",
    data => {

        myPlayer =
            data.player;

        roomCode.textContent =
            data.code;

        roomStatus.textContent =
            "You joined the room.";

        showRoom();

    }
);


socket.on(
    "errorMessage",
    message => {

        homeMessage.textContent =
            message;

    }
);


socket.on(
    "opponentJoined",
    () => {

        roomStatus.textContent =
            "Opponent joined! Click Ready.";

    }
);


socket.on(
    "roomState",
    state => {

        currentBoard =
            state.board;

        currentTurn =
            state.currentPlayer;

        gameRunning =
            state.gameStarted;

        timer.textContent =
            state.timeLeft;

        gameScore1.textContent =
            state.score1;

        gameScore2.textContent =
            state.score2;

        draws.textContent =
            state.draws;

        updateBoard();

        updatePlayers(
            state
        );

        updateScores(
            state
        );

        if (state.gameStarted) {

            showGame();

            updateTurn();

        }

    }
);


socket.on(
    "timer",
    time => {

        timer.textContent =
            time;

    }
);


socket.on(
    "result",
    data => {

        gameRunning = false;

        resultBox.classList.remove(
            "hidden"
        );

        rematchBtn.disabled = false;

        rematchBtn.textContent =
            "🔄 Rematch";

        if (data.winner === "DRAW") {

            resultIcon.textContent =
                "🤝";

            resultText.textContent =
                "It's a Draw!";

            resultDescription.textContent =
                "Good game! Try again.";

        } else {

            const iWon =
                (
                    data.winner === "X" &&
                    myPlayer === 1
                ) ||
                (
                    data.winner === "O" &&
                    myPlayer === 2
                );

            if (iWon) {

                resultIcon.textContent =
                    "🏆";

                resultText.textContent =
                    "You Win!";

                resultDescription.textContent =
                    "Excellent move!";

            } else {

                resultIcon.textContent =
                    "😔";

                resultText.textContent =
                    "You Lose!";

                resultDescription.textContent =
                    "Better luck next round.";

            }

        }

    }
);


socket.on(
    "rematchWaiting",
    () => {

        resultDescription.textContent =
            "Waiting for your opponent...";

    }
);


socket.on(
    "opponentLeft",
    () => {

        gameRunning = false;

        resultBox.classList.add(
            "hidden"
        );

        roomStatus.textContent =
            "Your opponent left the game.";

        readyBtn.disabled = true;

        readyBtn.textContent =
            "Waiting for Opponent";

        showRoom();

    }
);


function updateBoard() {

    boardCells.forEach(
        (cell, index) => {

            const value =
                currentBoard[index];

            cell.textContent =
                value;

            cell.classList.remove(
                "x",
                "o"
            );

            if (value === "X") {

                cell.classList.add(
                    "x"
                );

            }

            if (value === "O") {

                cell.classList.add(
                    "o"
                );

            }

        }
    );

}


function updateTurn() {

    if (!gameRunning) {

        turnText.textContent =
            "Game Over";

        return;
    }

    if (currentTurn === myPlayer) {

        turnText.textContent =
            "🟢 Your Turn";

    } else {

        turnText.textContent =
            "🔴 Opponent's Turn";

    }

}


function updatePlayers(state) {

    player1Status.querySelector(
        "span"
    ).textContent =
        state.player1
            ? state.ready1
                ? "✓ Ready"
                : "Connected"
            : "Waiting";

    player2Status.querySelector(
        "span"
    ).textContent =
        state.player2
            ? state.ready2
                ? "✓ Ready"
                : "Connected"
            : "Waiting";


    if (!state.player2) {

        roomStatus.textContent =
            "Waiting for opponent...";

        readyBtn.disabled = true;

        readyBtn.textContent =
            "Waiting for Opponent";

        return;
    }


    if (!state.gameStarted) {

        if (
            myPlayer === 1 &&
            !state.ready1
        ) {

            readyBtn.disabled = false;

            readyBtn.textContent =
                "✓ Ready";

        }

        if (
            myPlayer === 2 &&
            !state.ready2
        ) {

            readyBtn.disabled = false;

            readyBtn.textContent =
                "✓ Ready";

        }

    }

}


function updateScores(state) {

    if (myPlayer === 1) {

        yourScore.textContent =
            state.score1;

        opponentScore.textContent =
            state.score2;

    } else if (myPlayer === 2) {

        yourScore.textContent =
            state.score2;

        opponentScore.textContent =
            state.score1;

    }

}