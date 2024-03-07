import React from 'react';

function WaitingScreen({ name, gameCode, setName, setGameCode, connectToGame }) {
    return (
        <div>
            <label htmlFor="name">Enter Name:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            <label htmlFor="game-code">Enter Game Code:</label>
            <input type="text" id="game-code" value={gameCode} onChange={(e) => setGameCode(e.target.value)} />
            <button onClick={connectToGame}>Enter</button>
        </div>
    );
}

export default WaitingScreen;
