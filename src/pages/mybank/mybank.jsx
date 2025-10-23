import React, { useEffect, useState, useContext } from "react"
import account_box_icon from '../../images/account_box_icon.svg'
import { UserContext } from "../../config/userContext"
import { useNavigate } from "react-router-dom"
import './styles/mybank.css'

import Home from "./home"
import Operations from "./operations"
import Payments from "./payments"
import getPath from "../../config/serverClient"

export default function MyBank() {
    const { user } = useContext(UserContext)
    const tabs = ['Home', 'Operations', 'Payments']
    const [activeTab, setActiveTab] = useState(tabs[0])
    const navigate = useNavigate()

    const [home, setHome] = useState(null)
    const [operations, setOperations] = useState(null)
    const [payments, setPayments] = useState(null)

    useEffect(() => {
        setHome(<Home />)
        setOperations(<Operations />)
        setPayments(<Payments />)
    }, [])

    const navigateToProfile = () => {
        navigate('/profile')
    }

    const handleLogOut = async () => {
        try {
            await fetch(getPath('/auth/log-out'), {
                method: 'GET'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
            })

            navigate('/', { replace: true })
        } catch (err) {
            console.log(err.message)
        }
    }

    if (!user) return null

    return (
        <div className="MyBank">
            <header>
                <div className="first">
                    { tabs.map(tab => (
                        <div
                            key={ tab }
                            className={ `nav-item ${activeTab === tab && 'active'}` }
                            onClick={ () => activeTab !== tab && setActiveTab(tab) }
                        >
                            { tab }
                        </div>
                    )) }
                </div>
                <div className="last">
                    <div className="user-panel"  onClick={ navigateToProfile }>
                        <div>{ user.first_name || '' }</div>
                        <img
                            src={ account_box_icon }
                            alt=""
                        />
                    </div>
                    <div
                        className="logout"
                        onClick={ handleLogOut }>
                    logout</div>
                </div>
            </header>
            <div className="context">
                {
                    activeTab === 'Home' ? home :
                    activeTab === 'Operations' ? operations :
                    activeTab === 'Payments' ? payments : null
                }
            </div>
        </div>
    )
}
