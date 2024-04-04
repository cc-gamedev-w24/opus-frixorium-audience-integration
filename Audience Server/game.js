class Game {
    #gameCode;
    #audienceList;
    #unityClient;
    #gameState;
    #currentVotingTrials;

    constructor(unityClient, gameCode) {
        this.#unityClient = unityClient;
        this.#gameCode = gameCode;
        this.#audienceList = {};
        this.#gameState = GameStates.WAITING;
        this.#currentVotingTrials = {};
    }

    // Getters
    get gameCode() {
        return this.#gameCode;
    }

    get audienceList() {
        return this.#audienceList;
    }

    get unityClient() {
        return this.#unityClient;
    }

    get gameState() {
        return this.#gameState;
    }

    // Setters
    set gameState(newState) {
        this.#gameState = newState;
    }

    // Methods
    addPlayerToGame(identifier, socket) {
        if (!this.#audienceList[identifier]) {
            this.#audienceList[identifier] = socket;
            this.sendPlayerConnectionMessage('new_connection', identifier);
            console.log(`Player ${identifier} added to the game`);
        } else {
            console.log(`Player ${identifier} already exists in the game`);
        }
    }

    removePlayerFromGame(identifier) {
        if (this.#audienceList[identifier]) {
            delete this.#audienceList[identifier];
            this.sendPlayerConnectionMessage('client_disconnected', identifier);
            console.log(`Player ${identifier} removed from the game`);
        } else {
            console.log(`Player ${identifier} does not exist in the game`);
        }
    }

    setVotingTrials(trialNames) {
        this.#currentVotingTrials = {};
        trialNames.forEach(trialName => {
            this.#currentVotingTrials[trialName] = 0;
        });
    }

    handleVote(voteData, totalVotes) {
        const { trialName } = voteData;
    
        if (this.#currentVotingTrials.hasOwnProperty(trialName)) {
            this.#currentVotingTrials[trialName]++;
            console.log(`Vote received for ${trialName}`);
    
            if (totalVotes === Object.keys(this.#audienceList).length) {
                return true;
            } else {
                return false;
            }
        } else {
            console.log(`Invalid trial name: ${trialName}`);
            return false;
        }
    }    

    handleVoteResult() {
        let maxVotes = 0;
        let winningTrial = '';

        for (const trialName in this.#currentVotingTrials) {
            if (this.#currentVotingTrials.hasOwnProperty(trialName)) {
                const votes = this.#currentVotingTrials[trialName];
                if (votes > maxVotes) {
                    maxVotes = votes;
                    winningTrial = trialName;
                }
            }
        }

        const voteResultMessage = {
            messageType: 'vote_result',
            token: 'BTS02OQVKJ', // Update with the correct token
            gameCode: this.#gameCode,
            winningTrial: winningTrial
        };

        this.#unityClient.send(JSON.stringify(voteResultMessage));
    }

    sendPlayerConnectionMessage(messageType, identifier) {
        const connectionData = {
            messageType: messageType,
            token: 'BTS02OQVKJ',
            gameCode: this.#gameCode
        };
        this.#unityClient.send(JSON.stringify(connectionData));
    }
}

const GameStates = {
    WAITING: 'waiting',
    STARTED: 'started',
    ENDED: 'ended'
};

module.exports = {
    Game,
    GameStates
};
