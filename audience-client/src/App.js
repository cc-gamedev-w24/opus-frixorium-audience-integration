import React, { useState } from 'react';
import WaitingScreen from './WaitingScreen';
import VoteCards from './VoteCards';

function App() {
    const [name, setName] = useState('');
    const [gameCode, setGameCode] = useState('');
    const [connected, setConnected] = useState(false);
    const [showVoteCards, setShowVoteCards] = useState(false);
    const [trialNames, setTrialNames] = useState([]);
    const [ws, setWs] = useState(null);

    function connectToGame() {
        if (!ws) {
            const connectionData = {
                type: "game_client",
                token: "8DFMUBI21Y",
                gameCode: gameCode,
                identifier: name
            };

            const websocket = new WebSocket("ws://localhost:8080");
            websocket.onopen = function () {
                console.log("Connected to audience server");
                websocket.send(JSON.stringify(connectionData));
                setConnected(true);
            };
            websocket.onmessage = function (event) {
                var jsonData = JSON.parse(event.data);
                console.log(jsonData);
                if (jsonData.messageType === 'voting') {
                    setTrialNames(jsonData.trialNames);
                    setShowVoteCards(true);
                }
            };
            setWs(websocket);
        }
    }

    function sendVote(trialName) {
        // Construct vote data
        const voteData = {
            messageType: 'vote',
            token: '8DFMUBI21Y',
            gameCode: gameCode,
            trialName: trialName
        };

        // Send vote data over WebSocket
        ws.send(JSON.stringify(voteData));
        setShowVoteCards(false);
    }

    return (
        <div>
            <header>
                <h1>Opus Frixorium</h1>
            </header>
            {!connected ? (
                <WaitingScreen
                    name={name}
                    gameCode={gameCode}
                    setName={setName}
                    setGameCode={setGameCode}
                    connectToGame={connectToGame}
                />
            ) : showVoteCards ? (
                <VoteCards trialNames={trialNames} sendVote={sendVote} />
            ) : (
                <h1> Waiting for voting to start...</h1>
            )}
        </div>
    );
}

export default App;
