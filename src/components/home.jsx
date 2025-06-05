import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/home.css';

function Home() {
    const navigate = useNavigate();

    const handleNavigate = isLogInMode => {
        navigate(`/auth/${isLogInMode}`);
    }

    return (
        <body className='mainguard auth'>
            <header>
                <div class="container">
                    <h1 id='main-headline'>Loan genius</h1>
                </div>
                <nav>
                    {/* <Link to='/auth'>
                        <div className='navigate-element'>Control panel</div>
                    </Link> */}
                    <div className="navigate-panel">
                        <div className="log-in" onClick={ () => handleNavigate('1') }>Log in</div>
                        <div className="sign-up" onClick={ () => handleNavigate('0') }>Sign up</div>
                    </div>
                </nav>
            </header>
            
            <section class="hero">
                <div class="container">
                    <h2>A loan for any purpose up to 1 000 000₽</h2>
                    <p>Approval in 5 minutes | The rate starts from 5.9%</p>
                    <button class="cta-button">Submit an application</button>
                </div>
            </section>
            
            <div class="container">
                <section class="features">
                    <div class="feature-card">
                        <h3>📱 Online application form</h3>
                        <p>Without a visit to the bank</p>
                    </div>
                    <div class="feature-card">
                        <h3>⚡ A quick solution</h3>
                        <p>Response in 5 minutes</p>
                    </div>
                    <div class="feature-card">
                        <h3>💳 Any credit history</h3>
                        <p>We issue them even with delays</p>
                    </div>
                </section>
            </div>
        </body>
    );
}

export default Home;