import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../config/userContext";
import '../styles/employee.css'
import getPath, { getDateFromTimestamp } from "../config/serverClient";
import { showMessage } from "../components/messages";
import Loading from "../components/loading";
import { useNavigate } from "react-router-dom";

export default function Employee() {
    const { user } = useContext(UserContext)
    const tabs = ['Applications', 'Profile']
    const [activeTab, setActiveTab] = useState(tabs[0])
    const navigate = useNavigate()

    const [Applications, setApplications] = useState(<Applications />)

    const handleLogOut = async () => {
        try {
            const response = await fetch(getPath('/auth/log-out'), {
                method: 'GET'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
            })

            navigate('/', { replace: true })
        } catch (err) {}
    }

    return (
        <div className="Employee">
            <title>Employee</title>
            <header>
                <div className="row user">
                    <h2>{ `Employee: ${user.first_name}` }</h2>
                    <div
                        className="logout"
                        onClick={ handleLogOut }>
                    logout</div>
                </div>
                <div className="row tabs">
                    <div className="first">{
                        tabs.map(tab => 
                            <div
                                key={ tab }
                                className={ `nav-item ${activeTab === tab && 'active'}` }
                                onClick={ () => activeTab !== tab && setActiveTab(tab) }>
                                { tab }</div>
                        )
                    }</div>
                    <div className="last"></div>
                </div>
            </header>
            <div className="context">{
                activeTab === 'Applications' && Applications
            }</div>
        </div>
    )
}

function Applications() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataForm, setDataForm] = useState(null)
    const [reload, setReload] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch(getPath(`/applications/get-all`), {
                    method: 'GET'
                    ,headers: { 'Content-Type': 'application/json' }
                    ,credentials: 'include'
                })
                const data = await response.json()

                if (!response.ok || !data.success)
                    throw new Error(data.message)

                setApplications(data.data)
            } catch (err) {
                showMessage(err.message, 'error-message')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [reload])

    const handleClick = (appl) => {
        setDataForm(<DataForm appl={appl} onClose={ () => setDataForm(null) } reload={ () => setReload(prev => !prev) } />)
    }

    if (loading) return <Loading />

    if (applications.length === 0) return null

    return (
        <div className="Applications">{
            applications.map(appl => appl && appl.status === 'pending' &&
                <Application key={ appl.id } appl={ appl } onClick={ () => handleClick(appl) } />
            )}
            { dataForm && dataForm }
        </div>
    )
}

function Application({ appl, onClick }) {
    return (
        <div className="Application" onClick={ onClick }>
            <div className="row">
                <label>amount</label>
                <div>{appl.amount}</div>
            </div>
            <div className="row">
                <label>rate</label>
                <div>{appl.rate}</div>
            </div>
            <div className="row">
                <label>term</label>
                <div>{appl.term}</div>
            </div>
            <div className="row">
                <label>status</label>
                <div>{appl.status}</div>
            </div>
        </div>
    )
}

function DataForm({ appl, onClose, reload }) {
    const [loading, setLoading] = useState(false)
    const modes = ['application', 'user']
    const [mode, setMode] = useState(modes[0])
    const [user, setUser] = useState(null)
    const [product, setProduct] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
                const response = await fetch(getPath(`/applications/get-user?id=${appl.id}`), {
                    method: 'GET'
                    ,headers: { 'Content-Type': 'application/json' }
                    ,credentials: 'include'
                })
                const data = await response.json()

                if (!response.ok || !data.success)
                    throw new Error(data.message)

                setUser(data.data.users)
                setProduct(data.data.credit_products)
            } catch (err) {
                showMessage(err.message, 'error-message')
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [appl])

    const close = e => {
        if (e.target.className.includes('DataForm'))
            onClose()
    }

    const handleSetMode = (m) => {
        setMode(m)
    }

    const handleSelect = async (status) => {
        try {
            await fetch(getPath('/applications/set-status'), {
                method: 'POST'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
                ,body: JSON.stringify({
                    id: appl.id
                    ,status: status
                })
            })

            const today = new Date()
            const year = today.getFullYear()
            const month = today.getMonth() + (today.getDate() > 28 ? 2 : 1)
            const day = today.getDate() > 28 ? 1 : today.getDate()

            if (status !== 'approved') return
            const user_id = String(user.id)
            const accountNumber = `UI${user_id.length > 2 ? user_id[0] + user_id[1] : user_id}ND${getDateFromTimestamp(new Date())}DT${getDateFromTimestamp(appl.created_at)}PL`
            const response = await fetch(getPath('/loans/create'), {
                method: 'POST'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
                ,body: JSON.stringify({
                    application_id: appl.id
                    ,final_amount: appl.amount
                    ,final_term: appl.term
                    ,final_rate: appl.rate
                    ,disbursement_date: new Date(year, month, day)
                    ,account_number: accountNumber
                })
            })
            const data = await response.json()

            if (!response.ok || !data.success)
                throw new Error(data.message)

            const final_amount = appl.amount + appl.rate / 12 * appl.term * appl.amount

            const contractResponse = await fetch(getPath('/contracts/create'), {
                method: 'POST'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
                ,body: JSON.stringify({
                    loan_id: data.data.id
                    ,contract_number: accountNumber
                    ,start_date: new Date()
                    ,end_date: new Date(year, today.getMonth() + appl.term, day)
                    ,monthly_payment: final_amount / appl.term
                })
            })
            const contractData = await contractResponse.json()

            if (!contractResponse.ok || !contractData.success)
                throw new Error(contractData.message)
        } catch (err) {
            showMessage(err.message, 'error-message')
            console.error(err)
        } finally {
            // window.location.reload()
            reload()
        }
    }

    if (loading) return <Loading />

    if (!user || !product) return null
    
    return (
        <div className="DataForm" onClick={ close }>
            <div className="form">
                <div className="switch">
                    <div className={ `slider ${mode}` }>
                        <div></div>
                    </div>
                    { modes.map(m =>
                        <div key={m} onClick={ () => handleSetMode(m) }>{m}</div>
                    ) }
                </div>
                <div className={`data ${mode}`}>
                    <div className={ `${modes[0]}` }>
                        <div className="form">
                            <h2>Application</h2>
                            <div className="row">
                                <label>Product:</label>
                                <div>{ product.name }</div>
                            </div>
                            <div className="row">
                                <label>Amount:</label>
                                <div>{ appl.amount }</div>
                            </div>
                            <div className="row">
                                <label>Rate:</label>
                                <div>{ `${ appl.rate }%` }</div>
                            </div>
                            <div className="row">
                                <label>Term:</label>
                                <div>{ `${ appl.term } months` }</div>
                            </div>
                            <div className="row">
                                <label>Purpose:</label>
                                <div>{ `${ appl.purpose }` }</div>
                            </div>
                            <div className="row">
                                <label>Status:</label>
                                <div>{ `${ appl.status }` }</div>
                            </div>
                            <div className="row">
                                <label>Created at:</label>
                                <div>{ getDateFromTimestamp(appl.created_at) }</div>
                            </div>
                            <div className="row">
                                <label>Updated at:</label>
                                <div>{ (appl.updated_at && getDateFromTimestamp(appl.updated_at)) || 'Not updated' }</div>
                            </div>
                        </div>
                    </div>
                    <div className={ `${modes[1]}` }>
                        <div className="form">
                            <h2>User</h2>
                            <div className="row">
                                <label>First name:</label>
                                <div>{ user.first_name }</div>
                            </div>
                            <div className="row">
                                <label>Last name:</label>
                                <div>{ user.last_name }</div>
                            </div>
                            <div className="row">
                                <label>Middle name:</label>
                                <div>{ user.middle_name }</div>
                            </div>
                            <div className="row">
                                <label>Phone number:</label>
                                <div>{ user.phone_number }</div>
                            </div>
                            <div className="row">
                                <label>Email:</label>
                                <div>{ user.email }</div>
                            </div>
                            <div className="row">
                                <label>Birth date:</label>
                                <div>{ user.birth_date }</div>
                            </div>
                            <div className="row">
                                <label>Registration date</label>
                                <div>{ getDateFromTimestamp(user.registration_date) }</div>
                            </div>
                            <div className="row">
                                <label>Last login</label>
                                <div>{ getDateFromTimestamp(user.last_login) }</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tools">
                    <button className="cancel" onClick={ () => handleSelect('canceled') }>Cancel</button>
                    <button className="reject" onClick={ () => handleSelect('rejected') }>Reject</button>
                    <button className="approve" onClick={ () => handleSelect('approved') }>Approve</button>
                </div>
            </div>
        </div>
    )
}