import React, { useEffect, useState, useContext } from "react"
import getPath from "../config/serverClient"
import { showMessage } from "../components/messages"
import account_box_icon from '../images/account_box_icon.svg'
import { UserContext } from "../config/userContext"
import '../styles/mybank.css'
import { useNavigate } from "react-router-dom"

export default function MyBank() {
    const { user, setUser } = useContext(UserContext)
    const tabs = ['Home', 'Operations', 'Payments']
    const [activeTab, setActiveTab] = useState(tabs[0])
    const navigate = useNavigate()

    const navigateToProfile = () => {
        navigate('/profile')
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
                <div className="last" onClick={ navigateToProfile }>
                    <div>{ user.first_name || '' }</div>
                    <img
                        src={ account_box_icon }
                        alt=""
                    />
                </div>
            </header>
            <div className="context">
                {
                    activeTab === 'Home' ? <Home /> :
                    activeTab === 'Operations' ? <Operations /> :
                    activeTab === 'Payments' ? <Payments /> : null
                }
            </div>
        </div>
    )
}

function Home() {
    const { user } = useContext(UserContext)
    const [loans, setLoans] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch(getPath(`/loans/get-all?user_id=${user.id}`), {
                    method: 'GET'
                    ,headers: { 'Content-Type': 'application/json' }
                    ,credentials: 'include'
                })

                const data = await response.json()

                if (!response.ok || !data.success)
                    throw new Error(data.message)

                setLoans(data.loans)
            } catch (err) {
                showMessage(err.message, 'err-message')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <div>Loading...</div>

    return (
        <div className="Home">
            <div className="Loans">
                <h2>My loans</h2>
                { loans.map(appl =>
                    <Loan loan={ appl.loans } product={ appl.credit_products } />
                ) }
                <div className="Loan add-btn" onClick={ () => navigate('/products') }>
                    New product </div>
            </div>
        </div>
    )
}

function Operations() {
    return (
        <div className="Operations"></div>
    )
}

function Payments() {
    return (
        <div className="Payments"></div>
    )
}

function Loan({ loan, product }) {
    if (!loan || !product) return null
    return (
        <div className="Loan">
            <div className="row">{ product.name }</div>
        </div>
    )
}