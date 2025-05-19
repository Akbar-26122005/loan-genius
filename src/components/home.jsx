import React from 'react';

function Home() {
    return (
        <div className='mainguard auth'>
            <div>
                <button id='login-button' onClick={() => window.location.assign("/auth")}>Login</button>
            </div>
        </div>
    );
}

export default Home;