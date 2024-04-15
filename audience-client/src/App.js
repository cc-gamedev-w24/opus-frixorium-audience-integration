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
    const [errorMessage, setErrorMessage] = useState('');

    function connectToGame() {
        // Close the existing WebSocket connection if it exists
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
            setWs(null); // Reset WebSocket state
        }
    
        const connectionData = {
            type: "game_client",
            token: "8DFMUBI21Y",
            gameCode: gameCode.toUpperCase(),
            identifier: name
        };
    
        const websocket = new WebSocket("wss://chaosvult.exvacuum.dev:6124");
        websocket.onopen = () => {
            console.log("Connected to audience server");
            websocket.send(JSON.stringify(connectionData));
            setConnected(true);
        };
    
        websocket.onmessage = (event) => {
            var jsonData = JSON.parse(event.data);
            console.log(jsonData);
            if (jsonData.messageType === 'voting') {
                setTrialNames(jsonData.trialNames);
                setShowVoteCards(true);
            } else if (jsonData.messageType === 'no_game_found') {
                setErrorMessage('No game found with the provided code. Please try again.');
            } else if (jsonData.messageType === 'game_ended') {
                setErrorMessage('The game has ended. Thanks for playing!');
            } else if (jsonData.messageType === 'player_exists') {
                setErrorMessage('Player with provided name already exists. Please try again.');
            }
        };
    
        setWs(websocket);
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
        <div className='container'>
            <header>
                <h1 className="title">Chaos Vult</h1>
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
            ) : errorMessage && connected ? (
                <div className="card-container error-message">
                    <p>{errorMessage}</p>
                    <button className='button'  onClick={() => {
                        setErrorMessage('')
                        setConnected(false);
                    }}>Dismiss</button>
                </div>
            ) : (
                <h2 className='card-container error-message'> Waiting for voting to begin...</h2>
            )}
        </div>
    );
}

export default App;
