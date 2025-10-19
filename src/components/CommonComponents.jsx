import { React } from "react"
import back_icon from '../images/back_icon.svg'
import '../styles/CommonComponents.css'

export function BackButton({ onClick }) {
    return (
        <div
            className="BackButton"
            onClick={ onClick }
        >
            <img
                src={ back_icon }
                alt="back"
            />
        </div>
    )
}