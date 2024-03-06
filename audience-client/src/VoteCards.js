import React from 'react';
import './App.css'

function VoteCards({ trialNames, sendVote }) {
    const handleVote = (trialName) => {
        // Send the vote information over WebSocket
        sendVote(trialName);
    };

    return (
        <div>
            <h2>Vote for your choice:</h2>
            <div>
                {trialNames.map((trialName, index) => (
                    <div className="card" key={index}>
                        <p>{trialName}</p>
                        <button onClick={() => handleVote(trialName)}>Vote</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VoteCards;
