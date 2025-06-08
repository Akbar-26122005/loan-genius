import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import getPath from '../config/serverClient';

function Home({ user, setUser }) {
    const navigate = useNavigate();

    const handleNavigate = isLogInMode => {
        navigate(`/auth`);
    }

    const navigateToProfile = () => {
        navigate('/profile')
    }

    const handleLogOut = async () => {
        try {
            const response = await fetch(getPath('/auth/log-out'), {
                method: 'GET'
                ,headers: {
                    'Content-Type': 'application/json'
                }
                ,credentials: 'include'
            })
    
            const data = await response.json()
    
            if (!response.ok || !data.success)
                throw new Error(data.message)

            window.location.reload()
        } catch (err) { }
    }

    return (
        <div className='mainguard auth'>
            <header>
                <div className="container">
                    <h1 id='main-headline'>Loan genius</h1>
                </div>
                <nav>
                    {user === null
                        ?<div className="navigate-panel">
                            <div className="log-in" onClick={ () => handleNavigate() }>Log in</div>
                        </div>
                        :<div className="navigate-panel">
                            <div onClick={ navigateToProfile }>{ user.first_name }</div>
                            <div onClick={handleLogOut}>log out</div>
                        </div>
                    }
                </nav>
            </header>
            
            <section className="hero">
                <div className="container">
                    <h2>A loan for any purpose up to 1 000 000₽</h2>
                    <p>Approval in 5 minutes | The rate starts from 5.9%</p>
                    <button className="cta-button">Submit an application</button>
                </div>
            </section>
            
            <div className="container">
                <section className="features">
                    <div className="feature-card">
                        <h3>📱 Online application form</h3>
                        <p>Without a visit to the bank</p>
                    </div>
                    <div className="feature-card">
                        <h3>⚡ A quick solution</h3>
                        <p>Response in 5 minutes</p>
                    </div>
                    <div className="feature-card">
                        <h3>💳 Any credit history</h3>
                        <p>We issue them even with delays</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;