import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import menu_icon from '../images/menu_icon.svg'
import '../styles/floatingMenu.css'

export default function FloatingMenu() {
    const [isMenuShow, setIsMenuShow] = useState(false)
    // const navigate = useNavigate()
    
    const handleShowMenu = () => {
        setIsMenuShow(prev => !prev)
    }
    
    return (
        <div className="FloatingMenu">
            <div className="show-menu-btn" onClick={ handleShowMenu }>
                <img
                    src={ menu_icon }
                    alt="menu button"
                />
            </div>

            { isMenuShow &&
                <div className="menu">
                    <div onClick={ () => window.location.assign('/') }>Home</div> {/* navigate('/') */}
                    <div onClick={ () => window.location.assign('/credits') } >My credits</div> {/* navigate('/credits') */}
                    <div onClick={ () => window.location.assign('/products') } >Products</div> {/* navigate('/products') */}
                </div>
            }
        </div>
    )
}