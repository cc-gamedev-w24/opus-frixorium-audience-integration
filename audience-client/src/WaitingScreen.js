import React from 'react';


function WaitingScreen({ name, gameCode, setName, setGameCode, connectToGame }) {
    return (
        <div className='waiting-screen'>
            <div className='inputFields'>
                <label htmlFor="game-code">Game Code</label>
                <input className='text-box' type="text" id="game-code" placeholder='Enter Room Code...' value={gameCode} onChange={(e) => setGameCode(e.target.value)} />
            </div>
            <div className='inputFields'>
                <label htmlFor="name">Name</label>
                <input className='text-box' type="text" id="name" placeholder='Enter Your Name...' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <button className='play-btn' onClick={connectToGame}>PLAY</button>
            
            <div className='carousel-container'>
                <div id="carouselExampleControls" className="carousel slide img-carousel" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="../opus-1.png" className="d-block" alt="First slide" style={{ width: '300px', height: '200px' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="../opus-2.png" className="d-block" alt="Second slide" style={{ width: '300px', height: '200px' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="../opus-3.png" className="d-block" alt="Third slide" style={{ width: '300px', height: '200px' }} />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WaitingScreen;
