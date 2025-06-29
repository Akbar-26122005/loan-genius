import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import back_icon from '../resources/back_icon.svg';
import { UserContext } from '../config/userContext';
import getPath from '../config/serverClient';
import visibility_icon from '../resources/visibility_icon.svg';
import visibility_off_icon from '../resources/visibility_off_icon.svg';
import '../styles/auth.css';

export default function Auth() {
    const { user, setUser } = useContext(UserContext)
    const [isLogInMode, setIsLogInMode] = useState(true);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            window.location.replace('/mybank')
            return
        }
    }, [])

    function showMessage(msg) {
        setMessage(msg)
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }
    
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
        <div className='Auth'>
            <div className="auth-context">
                <div className={`context-rect ${isLogInMode ? '' : 'rect-state-signUp'}`}></div>
                {/* Форма для входа */}
                <LogInForm
                    isLogInMode={ isLogInMode }
                    goOverTransition={ goOverTransition }
                    passwordVisibilityControl={ passwordVisibilityControl }
                    showMessage={ showMessage }
                    user={ user }
                    setUser={ setUser }
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
                    showMessage={ showMessage }
                    user={ user }
                    setUser={ setUser }
                />
                {/* Кнопка возврата назад */}
                <div className='back-button' onClick={() => {navigate('/', { replace: true })}}>
                    <img src={back_icon} alt="" />
                </div>
            </div>
            <div className="message no-copy">{ message }</div>
        </div>
    );
}

function LogInForm({ isLogInMode, passwordVisibilityControl, goOverTransition, showMessage, user, setUser }) {
    const [showLogInPassword, setShowLogInPassword] = useState(false);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const userLogIn = async e => {
        e.preventDefault();
        try {
            const response = await fetch(getPath('/auth/log-in'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    login: login
                    ,password: password
                })
            })

            const data = await response.json()

            if (!response.ok || !data.success)
                throw new Error(data.message)

            window.location.replace('/mybank')
        } catch (err) {
            showMessage(err.message)
        }
    }

    return (
        <form
            className={ `login form ${isLogInMode ? '' : ' hide'}` }
            onSubmit={ userLogIn }
        >
            <h1 className='main-text'>Login</h1>
            <div className="row">
                <input required
                    type='text'
                    id='login-input'
                    placeholder=''
                    value={ login }
                    onChange={ e => setLogin(e.target.value) } />
                <label htmlFor="login-input">Login</label>
            </div>
            <div className='row'>
                <input required
                    type={showLogInPassword ? 'text' : 'password'}
                    id='password-input'
                    placeholder=''
                    value={ password }
                    onChange={ e => setPassword(e.target.value) } />
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

function SignUpForm({ isLogInMode, passwordVisibilityControl, goOverTransition, showMessage, user, setUser }) {
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);
    const [showSignUpRepeatPassword, setShowSignUpRepeatPassword] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('+7');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    
    const userSignUp = async e => {
        e.preventDefault();

        if (password !== repeatPassword) {
            showMessage('The password and the repeated password do not match')
            return
        }

        try {
            const response = await fetch(getPath('/auth/sign-up'), {
                method: 'POST'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
                ,body: JSON.stringify({
                    first_name: firstName
                    ,last_name: lastName
                    ,middle_name: middleName
                    ,email: email
                    ,phone_number: phoneNumber
                    ,password: password
                    ,birth_date: birthDate
                })
            })

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message)

            if (!data.success)
                throw new Error('Failed to register')

            window.location.replace('/mybank')
        } catch (err) {
            showMessage(err.message)
        }
    }

    const handleChangePhoneNumber = e => {
        let value = e.target.value;
        
        // Запрещаем удаление +7
        if (!value.startsWith('+7')) {
        value = '+7' + value.replace(/[^\d]/g, '');
        }
        
        // Ограничиваем длину (например, 12 символов: +7XXXXXXXXXX)
        if (value.length <= 12) {
            setPhoneNumber(value);
        }
    };

    return (
        <form
            className={ `signUp form ${!isLogInMode ? '' : 'hide'}` }
            onSubmit={ userSignUp } >
            <h1 className='main-text'>Sign up</h1>
            <div className="row">
                <input required
                    type='text'
                    id='first-name-input'
                    placeholder=''
                    value={ firstName }
                    onChange={ e => setFirstName(e.target.value) } />
                <label htmlFor="first-name-input">first name</label>
            </div>
            <div className="row">
                <input required
                    type='text'
                    id='last-name-input'
                    placeholder=''
                    value={ lastName }
                    onChange={ e => setLastName(e.target.value) } />
                <label htmlFor="last-name-input">last name</label>
            </div>
            <div className="row">
                <input
                    type='text'
                    id='middle-name-input'
                    placeholder=''
                    value={ middleName }
                    onChange={ e => setMiddleName(e.target.value) } />
                <label htmlFor="middle-name-input">middle name</label>
            </div>
            <div className="row">
                <input required
                    type='tel'
                    id='phone-number-input'
                    placeholder=''
                    value={ phoneNumber }
                    onChange={ handleChangePhoneNumber }
                    minLength={ 12 }/>
                <label htmlFor="phone-number-input">phone number</label>
            </div>
            <div className="row">
                <input required
                    type='email'
                    id='r-email-input'
                    placeholder=''
                    value={ email}
                    onChange={ e => setEmail(e.target.value) } />
                <label htmlFor="r-email-input">email</label>
            </div>
            <div className='row'>
                <input required
                    id='r-password-input'
                    name='password'
                    placeholder=''
                    type={showSignUpPassword ? 'text' : 'password'}
                    value={ password }
                    onChange={ e => setPassword(e.target.value) }
                    minLength={ 8 } />
                <label htmlFor="r-password-input">password</label>
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
                    value={ repeatPassword }
                    onChange={ e => setRepeatPassword(e.target.value) } />
                <label htmlFor="r-repeat-password-input">repeat password</label>
                <img alt="" id='sign-up-repeat-password-visibility-control' className='password-visibility-control'
                    onClick={() => passwordVisibilityControl(setShowSignUpRepeatPassword, showSignUpRepeatPassword, 'sign-up-repeat-password-visibility-control')}
                    src={ showSignUpRepeatPassword ? visibility_icon : visibility_off_icon} />
            </div>
            <div className="row">
                <input required
                    type='date'
                    id='r-date-input'
                    placeholder=''
                    value={ birthDate }
                    onChange={ e => setBirthDate(e.target.value) } />
                <label htmlFor="r-email-input">email</label>
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