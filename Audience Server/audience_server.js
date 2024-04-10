const { Game, GameStates } = require('./game');
const WebSocket = require('ws');
const PORT = process.env.PORT || 6124;
const HOST = '0.0.0.0';
const wss = new WebSocket.Server({ port: PORT, host: HOST });
const games = [];
let votesReceived = 0;

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;

    ws.on('error', (error) => {
        console.log(`WebSocket error from IP: ${ip}:`, error);
    });

    ws.on('message', (message) => {
        const data = parseMessage(message);

        if (data.messageType === 'authentication' && data.token === 'BTS02OQVKJ') {
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
    const game = new Game(ws, data.gameCode)
    games.push(game);
    ws.removeAllListeners('message');
    ws.on('message', (message) => handleGameMessages(message, game));
}

function handleAudienceClientConnection(data, ws) {
    console.log(`Audience client connected with game code: ${data.gameCode}`);
    const game = games.find((element) => element.gameCode === data.gameCode);
    if (game) {
        if (game.gameState === GameStates.STARTED) {
            console.log('Game has started, joining disabled');
            ws.close();
            return;
        }
        game.addPlayerToGame(data.identifier, ws);
        ws.removeAllListeners('message');
        ws.on('message', (message) => handleAudienceMessages(message, game));
    } else {
        ws.send(JSON.stringify({messageType: 'no_game_found'}));
    }
}

function handleCloseConnection(data) {
    const game = games.find((element) => element.gameCode === data.gameCode);
    if (game) {
        if (data.messageType === 'authentication') {
            const index = games.indexOf(game);
            if (index > -1) {
                games.splice(index, 1);
                console.log('Game deleted');
            }
        } else {
            game.removePlayerFromGame(data.identifier);
        }
    }
}

function parseMessage(message) {
    try {
        const data = JSON.parse(message);
        return data;
    } catch (error) {
        console.error('Invalid JSON received');
        return;
    }
}

function handleGameMessages(message, game) {
    const data = parseMessage(message);

    if (data.messageType === GameStates.STARTED) { // Game started, waiting for vote options
        // Update game state
        game.gameState = GameStates.STARTED;
        console.log(`Game ${game.gameCode} has started. Joining disabled`);
    } else if (data.messageType === GameStates.VOTING) { // Voting started
        sendMsgToClients(data, game);

        const { trialNames } = data;
        game.setVotingTrials(trialNames);
    } else if(data.messageType === GameStates.ENDED) { // Game ended
        sendMsgToClients(data, game);
        console.log(data);
    }
}

function sendMsgToClients(data, game) {
    // Send vote options to clients
    for (const identifier in game.audienceList) {
        if (game.audienceList.hasOwnProperty(identifier)) {
            const ws = game.audienceList[identifier];
            ws.send(JSON.stringify(data));
        }
    }
}

function handleAudienceMessages(message, game) {
    const jsonData = JSON.parse(message);
    votesReceived++;
    const result = game.handleVote(jsonData, votesReceived);
    if (result) {
        console.log('All votes received for current round');
        game.handleVoteResult();
        votesReceived = 0;
    }
}

console.log(`Server is running on: ${HOST}:${PORT}`);
