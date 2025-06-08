import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home({ user, setUser }) {
    const navigate = useNavigate();

    const handleNavigate = isLogInMode => {
        navigate(`/auth`);
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
                            <div>{ user.first_name }</div>
                            <div>log out</div>
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