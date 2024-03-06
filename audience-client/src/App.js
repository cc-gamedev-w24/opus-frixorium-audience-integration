import React, { useState } from 'react';
import WaitingScreen from './WaitingScreen';
import VoteCards from './VoteCards';

function App() {
    const [name, setName] = useState('');
    const [gameCode, setGameCode] = useState('');
    const [connected, setConnected] = useState(false);
    const [showVoteCards, setShowVoteCards] = useState(false);
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
                if (event.data === 'vote') {
                    setShowVoteCards(true);
                }
            };
            setWs(websocket);
        }
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
                <VoteCards />
            ) : (
                <h1> Waiting for game to start...</h1>
            )}
        </div>
    );
}

export default App;
