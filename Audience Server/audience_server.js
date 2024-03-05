const Game = require('./game');
const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });
const games = [];

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;

    ws.on('error', (error) => {
        console.log(`WebSocket error from IP: ${ip}:`, error);
    });

    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.error('Invalid JSON received');
            return;
        }

        if (data.type === 'authentication' && data.token === 'BTS02OQVKJ') {
            handleUnityClientConnection(data, ws);
        } else {
            handleAudienceClientConnection(data, ws);
        }

        ws.on('close', () => {
            handleCloseConnection(data);
        });
    });
});

function handleUnityClientConnection(data, ws) {
    console.log(`Unity client connected with game code: ${data.gameCode}`);
    games.push(new Game(ws, data.gameCode));
}

function handleAudienceClientConnection(data, ws) {
    console.log(`Audience client connected with game code: ${data.gameCode}`);
    const game = games.find((element) => element.gameCode === data.gameCode);
    if (game) {
        game.addPlayerToGame(data.identifier, ws);
    }
}

function handleCloseConnection(data) {
    const game = games.find((element) => element.gameCode === data.gameCode);
    if (game) {
        if (data.type === 'authentication') {
            const index = games.indexOf(game);
            if (index > -1) {
                games.splice(index, 1);
            }
        } else {
            game.removePlayerFromGame(data.identifier);
        }
    }
}

console.log(`Server is running on port: ${PORT}`);
