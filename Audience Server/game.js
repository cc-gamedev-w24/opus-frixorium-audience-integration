class Game {
	#gameCode;
	#playerList;
	#unityClient

	constructor(unityClient, gameCode) {
		this.#unityClient = unityClient;
		this.#gameCode = gameCode;
		this.#playerList = [];
	}

	get gameCode () {
		return this.#gameCode;
	}

	get playerList() {
		return this.#playerList;
	}

	get unityClient() {
		return this.#unityClient;
	}

	addPlayerToGame(identifier, socket) {
		if (!this.#playerList[identifier]) {
            this.#playerList[identifier] = socket; // Store the WebSocket connection associated with the player ID
			this.#unityClient.send('new_connection');
            console.log(`Player ${identifier} added to the game`);
        } else {
            console.log(`Player ${identifier} already exists in the game`);
        }
	}

	removePlayerFromGame(playerId) {
		if (this.#playerList[playerId]) {
            delete this.#playerList[playerId]; // Remove the player from the object
			this.#unityClient.send('client_disconnected');
            console.log(`Player ${playerId} removed from the game`);
        } else {
            console.log(`Player ${playerId} does not exist in the game`);
        }
	}
}

module.exports = Game;
