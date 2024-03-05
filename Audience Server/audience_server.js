const Game = require('../game');
const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });
const games = [];

wss.on('connection', function connection(ws, req) {
    const ip = req.socket.remoteAddress;
    console.log(`Client connected from IP: ${ip}`);

    ws.on('error', (error) => {
        console.log(`WebSocket error from IP: ${ip}:`, error);
    });

    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.log('Invalid JSON received');
            return;
        }

        if (data.type === 'authentication' && data.token === 'BTS02OQVKJ') {
            console.log(`Unity client connected with game code: ${data.gameCode}`);
            games.push(new Game(ws, data.gameCode));
        } else {
            console.log(`Audience client connected with game code: ${data.gameCode}`);
            const game = games.find((element) => element.gameCode === data.gameCode);
            if (game) {
                game.addPlayerToGame(data.identifier, ws);
				game.unityClient.send(JSON.stringify(`Audience member connected with identifier: ${data.identifier}`));
            }
        }

        ws.on('close', () => {
            console.log(`Client from IP: ${ip} disconnected`);
            const game = games.find((element) => element.gameCode === data.gameCode);
            if (game) {
                game.removePlayerFromGame(data.identifier);
                game.unityClient.send(JSON.stringify(`Audience member disconnected with identifier: ${data.identifier}`));
            }
        });
    });
});

console.log(`Server is running on port: ${PORT}`);
