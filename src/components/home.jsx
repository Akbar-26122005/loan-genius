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

    const handleCtaClick = () => {
        if (user === null)
            navigate('/auth')
        else
        navigate('/profile')
    }

    return (
        <div className='Home'>

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