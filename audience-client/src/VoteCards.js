import React from 'react';
import './App.css'

function VoteCards({ trialNames, sendVote }) {
    const handleVote = (trialName) => {
        sendVote(trialName);
    };

    return (
        <div className='card-container'>
            <h2 className='error-message' >Vote for your choice</h2>
            <div>
                {trialNames.map((trialName, index) => (
                    <div className="card" key={index}>
                        <p>{trialName}</p>
                        <button className='button' onClick={() => handleVote(trialName)}>Vote</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VoteCards;
