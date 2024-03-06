const {Game, GameStates} = require('./game');
const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });
const games = [];

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;

    // Error event listener
    ws.on('error', (error) => {
        console.log(`WebSocket error from IP: ${ip}:`, error);
    });

    // Message event listener for creating/adding players
    ws.on('message', (message) => {
        const data = parseMessage(message);

        // Unity client connecting
        if (data.messageType === 'authentication' && data.token === 'BTS02OQVKJ') {
            handleUnityClientConnection(data, ws);
        } else { // audience member connecting
            handleAudienceClientConnection(data, ws);
        }

        // Close connection event listener
        ws.on('close', () => {
            // Disconnect player or delete game
            handleCloseConnection(data);
        });
    });
});

function handleUnityClientConnection(data, ws) {
    console.log(`Unity client connected with game code: ${data.gameCode}`);

    // Create new game
    const game = new Game(ws, data.gameCode)
    games.push(game);

    // Update message listeners
    ws.removeAllListeners('message');
    ws.on('message', (message) => handleGameMessages(message, game));
}

function handleAudienceClientConnection(data, ws) {
    console.log(`Audience client connected with game code: ${data.gameCode}`);

    // Check if game exists
    const game = games.find((element) => element.gameCode === data.gameCode);

    // Game exists and is in the waiting state
    if (game) {
        if(game.gameState === GameStates.STARTED) {
            console.log('Game has started, joining disabled');
            ws.close();
            return;
        }

        // Add player to game
        game.addPlayerToGame(data.identifier, ws);

        // Update message listeners
        ws.removeAllListeners('message');
        ws.on('message', handleAudienceMessages);
    }
}

function handleCloseConnection(data) {
    // See if the game exists
    const game = games.find((element) => element.gameCode === data.gameCode);

    // Game exists
    if (game) {
        // if the disconnecting client is unity, delete the game
        if (data.messageType === 'authentication') {
            const index = games.indexOf(game);
            if (index > -1) {
                games.splice(index, 1);
                console.log('Game deleted');
            }
        } else { // if audience disconnecting, remove from game
            game.removePlayerFromGame(data.identifier);
        }
    }
}

function parseMessage(message) {
    try {
        // Parse the incoming json
        const data = JSON.parse(message);
        return data;
    } catch (error) {
        console.error('Invalid JSON received');
        return;
    }
}

function handleGameMessages(message, game) {
    // Parse the incoming message
	const data = parseMessage(message);
    console.log(data);
    
    // Game started
    if(data.messageType === GameStates.STARTED) {
        game.gameState = GameStates.STARTED;
        console.log(`Game ${game.gameCode} has started. Joining disabled`);
    } else if (data.messageType === 'vote') { // voting started
        // Send voting options to all clients
        for(const identifier in game.audienceList) {
            if(game.audienceList.hasOwnProperty(identifier)) {
                const ws = game.audienceList[identifier];
                // TODO: Implement voting options
                ws.send('vote');
            }
        }
    }
}

function handleAudienceMessages(message) {
    console.log(message);
}

console.log(`Server is running on port: ${PORT}`);
