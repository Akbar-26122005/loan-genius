import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import back_icon from '../resources/back_icon.svg';
import visibility_icon from '../resources/visibility_icon.svg';
import visibility_off_icon from '../resources/visibility_off_icon.svg';
import getPath from '../config/serverClient';

function Auth() {
    const [isLogInMode, setIsLogInMode] = useState(true);
    const navigate = useNavigate();
    
    function passwordVisibilityControl(swapFunction, value, focusElement) {
        swapFunction(!value);
        document.getElementById(focusElement).focus();
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
    
    async function goOverTransition() {
        tryInit();
        setIsLogInMode(!isLogInMode);
        if (contextRect.classList.contains(rectStateSignUp)) {
            contextRect.classList.remove(rectStateSignUp);

            // Установка задержки перед применением перехода
            signUpMeeting.style.transitionDelay = '0';
            signUpForm.style.transitionDelay = '0';

            loginMeeting.style.transitionDelay = '2.3s';
            loginForm.style.transitionDelay = '2.3s';

            signUpMeeting.style.display = 'none';
            signUpForm.style.display = 'none';

            loginMeeting.style.display = 'flex';
            loginForm.style.display = 'flex';
        } else {
            contextRect.classList.add(rectStateSignUp);

            // Установка задержки перед применением перехода
            loginMeeting.style.transitionDelay = '0';
            loginForm.style.transitionDelay = '0';

            signUpMeeting.style.transitionDelay = '2.3s';
            signUpForm.style.transitionDelay = '2.3s';
            
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
                <div className={`context-rect ${isLogInMode ? '' : 'rect-state-signUp'}`}></div>
                {/* Форма для входа */}
                <LogInForm
                    isLogInMode={ isLogInMode }
                    goOverTransition={ goOverTransition }
                    passwordVisibilityControl={ passwordVisibilityControl }
                />
                {/* Приветствие пользователя при входе */}
                <div className={ `login meeting ${ isLogInMode ? '' : 'hide' }` }>
                    <h1 className="main-text">
                        <div onClick={() => goOverTransition()}>WELCOME</div>
                        <div>BACK!</div>
                    </h1>
                    <div className="plain-text">
                        <div>We're happy to have</div>
                        <div>you with us back</div>
                        <div>again! If you need</div>
                        <div>anything, we're here to</div>
                        <div>help</div>
                    </div>
                </div>

                {/*  */}
                {/* Регистрация */}
                {/*  */}

                {/* Приветствие пользователя при регистрации */}
                <div className={ `signUp meeting ${ !isLogInMode ? '' : 'hide' }`}>
                    <div className="main-text">
                        <h1>WELCOME!</h1>
                    </div>
                    <div className="plain-text">
                        <div>We're delighted to</div>
                        <div>have you here. If you</div>
                        <div>need any assistance,</div>
                        <div>feel free to reach out.</div>
                    </div>
                </div>
                {/* Форма регистрации */}
                <SignUpForm
                    isLogInMode={ isLogInMode }
                    goOverTransition={ goOverTransition }
                    passwordVisibilityControl={ passwordVisibilityControl }
                />
                {/* Кнопка возврата назад */}
                <div className='back-button' onClick={() => {navigate('/', { replace: true })}}>
                    <img src={back_icon} alt="" />
                </div>
            </div>
        </div>
    );
}

export default Auth;

function LogInForm({ isLogInMode, passwordVisibilityControl, goOverTransition }) {
    const [showLogInPassword, setShowLogInPassword] = useState(false);

    const userLogIn = async () => {
        try {
            const response = await fetch(getPath('/auth/get'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({})
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.message)
        } catch (err) { }
    }

    return (
        <form
            className={ `login form ${isLogInMode ? '' : ' hide'}` }
            onSubmit={userLogIn()}
        >
            <h1 className='main-text'>Login</h1>
            <div className="row">
                <input type='text' id='login-input' name='login' placeholder='' required />
                <label htmlFor="login-input">Login</label>
            </div>
            <div className='row'>
                <input required
                    id='password-input'
                    name='password'
                    placeholder=''
                    type={showLogInPassword ? 'text' : 'password'}/>
                <label htmlFor="password-input">
                    Password</label>
                <img
                    alt="" id='log-in-password-visibility-control'
                    className='password-visibility-control'
                    onClick={() => passwordVisibilityControl(setShowLogInPassword, showLogInPassword, 'log-in-password-visibility-control')}
                    src={ showLogInPassword ? visibility_icon : visibility_off_icon} />
            </div>
            <button id='log-in-btn'>Login</button>
            <div>
                <div className='transition-hint'>
                    Don't have an account?</div>
                <div className='transition-link' id='go-to-sign-up' onClick={ () => goOverTransition() }>
                    Sign up</div>
            </div>
        </form>
    );
}

function SignUpForm({ isLogInMode, passwordVisibilityControl, goOverTransition }) {
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);
    const [showSignUpRepeatPassword, setShowSignUpRepeatPassword] = useState(false);
    
    const userSignUp = async () => {

    }

    return (
        <form
            className={ `signUp form ${!isLogInMode ? '' : 'hide'}` }
            onSubmit={userSignUp()}
        >
            <h1 className='main-text'>Sign up</h1>
            <div className="row">
                <input type='text' id='r-name-input' name='login' placeholder='' required />
                <label htmlFor="r-name-input">name</label>
            </div>
            <div className="row">
                <input type='email' id='r-email-input' name='login' placeholder='' required />
                <label htmlFor="r-email-input">email</label>
            </div>
            <div className='row'>
                <input required
                    id='r-password-input'
                    name='password'
                    placeholder=''
                    type={showSignUpPassword ? 'text' : 'password'} />
                <label htmlFor="r-password-input">
                    Password</label>
                <img alt="" id='sign-up-password-visibility-control' className='password-visibility-control'
                    onClick={() => passwordVisibilityControl(setShowSignUpPassword, showSignUpPassword, 'sign-up-password-visibility-control')}
                    src={ showSignUpPassword ? visibility_icon : visibility_off_icon} />
            </div>
            <div className='row'>
                <input required
                    id='r-repeat-password-input'
                    name='r-repeat-password'
                    placeholder=''
                    type={showSignUpRepeatPassword ? 'text' : 'password'}
                />
                <label htmlFor="r-repeat-password-input">
                    Password</label>
                <img alt="" id='sign-up-repeat-password-visibility-control' className='password-visibility-control'
                    onClick={() => passwordVisibilityControl(setShowSignUpRepeatPassword, showSignUpRepeatPassword, 'sign-up-repeat-password-visibility-control')}
                    src={ showSignUpRepeatPassword ? visibility_icon : visibility_off_icon} />
            </div>
            <button id='log-in-btn'>Sign up</button>
            <div>
                <div className='transition-hint'>
                    Don't have an account?</div>
                <div className='transition-link' id='go-to-log-in' onClick={ () => goOverTransition() }>
                    <div>Sign up</div>
                </div>
            </div>
        </form>
    );
}