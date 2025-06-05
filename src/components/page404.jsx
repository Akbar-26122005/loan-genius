import React from 'react';
import '../styles/page404.css';
import logo from '../resources/logo.svg';

function Page404() {
    return (
        <div className='mainground err'>
            <h1>Данной страницы не существует!</h1>
            <h2>Код ошибки: 404</h2>
            <img src={logo} alt="react-logo" className='App-logo' />
        </div>
    );
}

export default Page404;