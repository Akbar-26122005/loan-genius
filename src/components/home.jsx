import React from 'react';

function Home() {

    const navigateToLogin = () => {
        window.location.assign("/login");
    };

    return (
        <div className='mainguard auth'>
            <div>
                <button id='login-button' onClick={navigateToLogin}>Login</button>
                <button id='registration-button'>Registration</button>
            </div>
        </div>
    );
}

export default Home;