import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getPath from '../config/serverClient';
import person_icon from '../images/person_icon.svg'
import { showMessage } from '../components/messages';
import { UserContext } from '../config/userContext';
import '../styles/home.css';

function Home() {
    const { user } = useContext(UserContext)
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
        } catch (err) {
            showMessage(err.message, 'error-message')
        }
    }

    const handleCtaClick = () => {
        if (user === null)
            navigate('/auth')
        else
        navigate('/products')
    }

    const handleNavigateToPersonalAccount = () => {
        window.location.assign('mybank')
    }

    return (
        <div className='Home'>
            <header>
                <div className="container">
                    <h1 id='main-headline'>Loan genius</h1>
                </div>
                <nav>
                    <div onClick={ handleNavigateToPersonalAccount }>
                        <div>Personal account</div>
                        <img
                            src={ person_icon }
                            alt=""
                        />
                    </div>
                </nav>
            </header>
            <section className="hero">
                <div className="container">
                    <h2>A loan for any purpose up to 1 000 000₽</h2>
                    <p>Approval in 5 minutes | The rate starts from 5.9%</p>
                    <button className="cta-button" onClick={ handleCtaClick }>Submit an application</button>
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