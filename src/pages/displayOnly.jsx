import React from "react"
import logo from '../resources/logo.svg'
import '../styles/displayOnly.css';

export function InDevelopment() {
    return (
        <div className='InDevelopment'>
            <h1>This page is under development!</h1>
            <img src={logo} alt="react-logo" className='App-logo' />
        </div>
    );
}

export function Page404() {
    return (
        <div className='Page404'>
            <h1>This page does not exist!</h1>
            <h2>Error code: 404</h2>
        </div>
    );
}