import React, { useState } from 'react';
import './auth.css';
import back_icon from '../resources/back_icon.svg';
import visibility_icon from '../resources/visibility_icon.svg';
import visibility_off_icon from '../resources/visibility_off_icon.svg';

function Login() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLogInMode, setIsLogInMode] = useState(true);
    
    function passwordVisibilityControl() {
        if (showPassword)
            setShowPassword(false);
        else {
            setShowPassword(true);
        }
        document.getElementById('password-input').focus();
    }

    let initialized = false;
    let contextRect = null;
    let loginMeeting = null;
    let loginForm = null;
    let signUpMeeting = null;
    let signUpForm = null;
    const rectStateSignUp = 'rect-state-signUp';

    function tryInit() {
        if (initialized) return;
        contextRect = document.querySelector('.context-rect');

        //login
        loginMeeting = document.querySelector('.login.meeting');
        loginForm = document.querySelector('.login.form');
        //sign up
        signUpMeeting = document.querySelector('.signUp.meeting');
        signUpForm = document.querySelector('.signUp.form');

        initialized = true;
    }
    
    function goOverTransition() {
        tryInit();
        setIsLogInMode(!isLogInMode);
        if (contextRect.classList.contains(rectStateSignUp)) {
            contextRect.classList.remove(rectStateSignUp);

            signUpMeeting.style.display = 'none';
            signUpForm.style.display = 'none';

            loginMeeting.style.display = 'flex';
            loginForm.style.display = 'flex';
        } else {
            contextRect.classList.add(rectStateSignUp);
            
            signUpMeeting.style.display = 'flex';
            signUpForm.style.display = 'flex';
            
            loginMeeting.style.display = 'none';
            loginForm.style.display = 'none';
        }
        console.log(isLogInMode);
    }

    return (
        <div className='mainground auth'>
            <div className="auth-context">
                {/* Кнопка возврата назад */}
                <div className='back-button' onClick={() => {window.history.back()}}>
                    <img src={back_icon} alt="" />
                </div>

                <div className={`context-rect ${isLogInMode ? '' : 'rect-state-signUp'}`}></div>
                {/* Форма для входа */}
                <form className={ `login form ${isLogInMode ? '' : ' hide'}` } onSubmit={ () => console.log('trying login.') }>
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
                    <div>
                        <div className='transition-hint'>
                            Don't have an account?</div>
                        <div className='transition-link' id='go-to-registration' onClick={ () => goOverTransition() }>
                            Sign up</div>
                    </div>
                </form>
                {/* Приветствие пользователя при входе */}
                <div className="login meeting">
                    <div className="main-text">
                        <div onClick={() => goOverTransition()}>WELCOME</div>
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

                {/* Приветствие пользователя при регистрации */}
                <div className='signUp meeting hide'>
                    <div className="main-text">
                        <div>WELCOME!</div>
                    </div>
                    <div className="plain-text">
                        <div>We're delighted to</div>
                        <div>have you here. If you</div>
                        <div>need any assistance,</div>
                        <div>feel free to reach out.</div>
                    </div>
                </div>
                {/* Форма регистрации */}
                <form className={ `signUp form ${!isLogInMode ? '' : 'hide'}` }>
                    <h1 className='main-text'>Sign up</h1>
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
                    <div>
                        <div className='transition-hint'>
                            Don't have an account?</div>
                        <div className='transition-link' id='go-to-registration' onClick={ () => goOverTransition() }>
                            Sign up</div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;