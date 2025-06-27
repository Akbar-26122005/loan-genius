import React, { useEffect, useState, useContext, memo } from "react"
import getPath from "../config/serverClient"
import { showMessage } from "../components/messages"
import account_box_icon from '../images/account_box_icon.svg'
import { UserContext } from "../config/userContext"
import Loading from "../components/loading"
import '../styles/mybank.css'
import { useNavigate } from "react-router-dom"
import back_icon from '../images/back_icon.svg'

export default function MyBank() {
    const { user, setUser } = useContext(UserContext)
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
                    activeTab === 'Home' ? home :
                    activeTab === 'Operations' ? operations :
                    activeTab === 'Payments' ? payments : null
                }
            </div>
        </div>
    )
}

const Home = memo(() => {
    const { user } = useContext(UserContext)
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectLoan, setSelectLoan] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        try {
            setLoading(true)
            setApplications([...user.applications])
        } catch (err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }, [user])

    if (loading) return <Loading />

    return (
        <div className="Home">
            <div className="Loans">
                <h2>My loans</h2>
                { applications.map(appl =>
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
                            <div>{ selectLoan.final_rate } %</div>
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
})

function Operations() {
    return (
        <div className="Operations"></div>
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


function Payments() {
    const { user } = useContext(UserContext)
    const [payments, setPayments] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedPayment, selectedPaymentChange] = useState(null)

    useEffect(() => {
        setLoading(true)
        try {
            const data = user.applications.flatMap(application =>
                application.loans.contracts.flatMap(contract =>
                    contract.payments || []
                ) || []
            )
            const contracts = {}
            for (const payment of data) {
                const contract = `id${payment.contract_id}`
                if (!contracts[contract])
                    contracts[contract] = []

                contracts[contract].push(payment)
            }
            const payments = []
            for (const contract in contracts) {
                payments.push(
                    contracts[contract].reduce((ac, cr) =>
                        cr.status === 'scheduled'
                        && new Date(cr.scheduled_date).getTime() < new Date(ac.scheduled_date).getTime()
                        ? cr : ac
                    )
                )
            }
            setPayments(payments)
        } catch (err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }, [user])

    const handleCloseForm = e => {
        if (e.target.className.includes('payment-form'))
            selectedPaymentChange(null)
    }

    if (loading) return <Loading />

    if (!payments) return null

    return (
        <div className="Payments">
            <h2>Payments</h2>
            <div className="payments">
                {
                    payments.map((pmt) => 
                        <Payment
                            key={ pmt.id }
                            payment={ pmt }
                            onClick={ () => selectedPaymentChange(pmt) }
                        />
                    )
                }
            </div>
            { selectedPayment &&
                <div className="payment-form" onClick={ handleCloseForm }></div>
            }
        </div>
    )
}

function Payment({ payment, onClick }) {
    const { user } = useContext(UserContext)
    const [contract, setContract] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(false)

    useEffect(() => {
        const contracts = user.applications.flatMap((appl) =>
            appl.loans.contracts.map((contract) => contract)
        )
        setContract(
            contracts.reduce((ac, cr) =>
                cr.payments.includes(payment) ? cr : ac
            )
        )
    }, [user])

    const handleClick = () => {
        setSelected(prev => !prev)
    }

    if (loading) return <Loading />
    if (!contract) return null

    return (
        <div className="Payment">
            <div className="column first">
                <div className="row">
                    <label>Account:</label>
                    <div>{ contract.contract_number }</div>
                </div>
                <div className="row">
                    <label>Pay before:</label>
                    <div>{ payment.scheduled_date }</div>
                </div>
                <div className="row">
                    <label>Amount:</label>
                    <div>{ payment.amount } ₽</div>
                </div>
            </div>
            <div className={ `column middle ${selected && 'active'}` }>
                <div>
                    <button
                        className={ `tool ${ selected && 'active' }` }
                        onClick={ onClick }
                        >To pay</button>
                </div>
            </div>
            <div
                className={`column last ${ selected && 'active' }`}
                onClick={ handleClick }
                >
                <img
                    src={ back_icon }
                    alt=""
                />
            </div>
        </div>
    )
}