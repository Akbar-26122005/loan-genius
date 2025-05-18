import React, { useState } from 'react';
import './auth.css';
import back_icon from '../resources/back_icon.svg';
import visibility_icon from '../resources/visibility_icon.svg';
import visibility_off_icon from '../resources/visibility_off_icon.svg';

function Login() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [nowLogInState, setNewState] = useState(true);

    const loginSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const [ login, password ] = [ formData.get('login'), formData.get('password') ];

        try {
            const response = await fetch('http://localhost:5000/login-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Указываем, что ожидаем JSON-ответ
                },
                body: JSON.stringify({ login, password })
            });

            if (!response.ok)
                throw new Error('Сетевая ошибка: ' + response.statusText);

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    function passwordVisibilityControl() {
        if (showPassword)
            setShowPassword(false);
        else
            setShowPassword(true);
        document.getElementById('password-input').focus();
    }

    function goOverTransition() {
        console.log(nowLogInState);
        setNewState(!nowLogInState);
    }

    return (
        <div className='mainground auth'>
            <div className="auth-context">
                <div className='back-button' onClick={() => {window.history.back()}}>
                    <img src={back_icon} alt="" />
                </div>
                <form className='login form' onSubmit={loginSubmit}>
                    <h1 className='main-text'>Login</h1>
                    <div className="row">
                        <input type='text' id='login-input' name='login' placeholder='' required />
                        <label htmlFor="login-input">Login</label>
                    </div>
                    <div className='row'>
                        <input id='password-input' name='password' placeholder='' required
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)}} />
                        <label htmlFor="password-input">
                            Password</label>
                        <img alt="" id='password-visibility-control' onClick={passwordVisibilityControl}
                            src={ showPassword ? visibility_icon : visibility_off_icon} />
                    </div>
                    <button id='log-in-btn'>Login</button>
                    <div className='transition-hint'>
                        Don't have an account?</div>
                    <div className='transition-link' id='go-to-registration' onClick={() => goOverTransition()}>
                        Sign up</div>
                </form>
                <div className="context-rect animate-to-registration"></div>
                <div className="login meeting">
                    <div className="main-text">
                        <div>WELCOME</div>
                        <div>BACK!</div>
                    </div>
                    <div className="plain-text">
                        <div>We're happy to have</div>
                        <div>you with us back</div>
                        <div>again! If you need</div>
                        <div>anything, we're here to</div>
                        <div>help</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;