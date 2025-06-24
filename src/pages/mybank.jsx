import React, { useEffect, useState, useContext } from "react"
import getPath from "../config/serverClient"
import { showMessage } from "../components/messages"
import account_box_icon from '../images/account_box_icon.svg'
import { UserContext } from "../config/userContext"
import Loading from "../components/loading"
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
    const [selectLoan, setSelectLoan] = useState(null)
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

    if (loading) return <Loading />

    return (
        <div className="Home">
            <div className="Loans">
                <h2>My loans</h2>
                { loans.map(appl =>
                    <Loan
                        key={appl.id}
                        loan={ appl.loans }
                        product={ appl.credit_products }
                        onClick={ () => setSelectLoan(appl.loans) }
                        isActive={ selectLoan === appl.loans }
                    />
                ) }
                <div className="Loan add-btn" onClick={ () => navigate('/products') }>
                    New product </div>
            </div>
            <div className="data">
                { selectLoan && console.log(selectLoan) }
                { !selectLoan ? null :
                    <div className="about">
                        <h2>About the loan</h2>
                        <div className="row">
                            <label>Account number</label>
                            <div>{ selectLoan.account_number }</div>
                        </div>
                        <div className="row">
                            <label>Initial amount</label>
                            <div>{ selectLoan.final_amount }</div>
                        </div>
                        <div className="row">
                            <label>Rate</label>
                            <div>{ selectLoan.final_rate }</div>
                        </div>
                        <div className="row">
                            <label>Term</label>
                            <div>{ `${ selectLoan.final_term } months` }</div>
                        </div>
                        <div className="row">
                            <label>Disbursement date</label>
                            <div>{ selectLoan.disbursement_date }</div>
                        </div>
                    </div>
                }
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

function Loan({ loan, product, onClick, isActive }) {
    const handleClick = () => {
        onClick()
    }

    if (!loan || !product) return null
    return (
        <div className={`Loan ${ isActive && 'active' }`} onClick={ handleClick }>
            <div className="row">{ product.name }</div>
        </div>
    )
}