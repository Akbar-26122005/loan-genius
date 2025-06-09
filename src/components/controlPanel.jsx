import React from "react";
import getPath from "../config/serverClient";
import '../styles/controlPanel.css';

export default function ControlPanel({ user }) {

    const handleNavigate = isLogInMode => {
        window.location.assign('/auth')
    }

    const navigateToProfile = () => {
        if (!window.location.href.includes('/profile'))
            window.location.assign('/profile')
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

            window.location.replace('/')
        } catch (err) { }
    }
  
    return (user === null
        ? <div className="navigate-panel">
            <div className="log-in" onClick={ handleNavigate }>Log in</div>
        </div>
        : <div className="navigate-panel">
            <div onClick={ navigateToProfile }>{ user.first_name }</div>
            <div onClick={ handleLogOut }>log out</div>
        </div>
    )
}