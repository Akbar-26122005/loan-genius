import React, { useState, useContext, useEffect, memo } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../config/userContext"
import Loading from "../../components/loading"
import './styles/home.css'

export default function Home() {
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