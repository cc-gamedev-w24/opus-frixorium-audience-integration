class Game {
    #gameCode;
    #audienceList;
    #unityClient;
	#gameState;

    constructor(unityClient, gameCode) {
        this.#unityClient = unityClient;
        this.#gameCode = gameCode;
        this.#audienceList = {};
		this.#gameState = GameStates.WAITING;
    }

	// Game code getter
    get gameCode() {
        return this.#gameCode;
    }

	// Player List getter
    get audienceList() {
        return this.#audienceList;
    }

	// Unity client getter
    get unityClient() {
        return this.#unityClient;
    }

	// Game state getter
	get gameState() {
		return this.#gameState;
	}
	
	// Game state setter
	set gameState(newState) {
		this.#gameState = newState;
	}

	// Handles adding audience members to list
    addPlayerToGame(identifier, socket) {
		// Player isn't already in the game
        if (!this.#audienceList[identifier]) {
			// Add player and socket to the list
            this.#audienceList[identifier] = socket;

			// Update the player count in unity
            this.#unityClient.send('new_connection');
            console.log(`Player ${identifier} added to the game`);
        } else {
            console.log(`Player ${identifier} already exists in the game`);
        }
    }

    removePlayerFromGame(identifier) {
		// Player is in the game
        if (this.#audienceList[identifier]) {
			// Delete player from list
            delete this.#audienceList[identifier];

			// Update player count in unity
            this.#unityClient.send('client_disconnected');
            console.log(`Player ${identifier} removed from the game`);
        } else {
            console.log(`Player ${identifier} does not exist in the game`);
        }
    }
}

const GameStates = {
	WAITING: 'waiting',
	STARTED: 'started',
	ENDED: 'ended'
}

module.exports = {
	Game,
	GameStates
}
