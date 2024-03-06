import React from 'react';

function VoteCards() {
    return (
        <div>
            <h2>Vote for your choice:</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div className="card">Choice 1</div>
                <div className="card">Choice 2</div>
                <div className="card">Choice 3</div>
            </div>
        </div>
    );
}

export default VoteCards;
