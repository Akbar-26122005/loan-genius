import React, { useState, useContext, useEffect } from "react"
import { UserContext } from "../../config/userContext"
import Loading from "../../components/loading"
import back_icon from '../../images/back_icon.svg'
import Form from "./form"
import './styles/payments.css'

export default function Payments() {
    const { user } = useContext(UserContext)
    const [payments, setPayments] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedPayment, selectedPaymentChange] = useState(null)
    const [showForm, showFormChange] = useState(false)

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
                            formOpen={ () => selectedPaymentChange(pmt) }
                        />
                    )
                }
            </div>
            { selectedPayment &&
                <Form
                    payment={ selectedPayment }
                    onClose={ () => selectedPaymentChange(null) }
                />
            }
        </div>
    )
}

function Payment({ payment, formOpen }) {
    const { user } = useContext(UserContext)
    const [contract, setContract] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        try {
            const contracts = user.applications.flatMap((appl) =>
                appl.loans.contracts.map((contract) => contract)
            )
            setContract(
                contracts.reduce((ac, cr) =>
                    cr.payments.includes(payment) ? cr : ac
                )
            )
        } finally {
            setLoading(false)
        }
    }, [user])

    const handleClick = () => {
        formOpen()
    }

    if (loading) return <Loading />
    if (!contract) return null

    return (
        <div className="Payment" onClick={ handleClick }>
            <div className="column first">
                <div className="row">
                    <label>Contract:</label>
                    <div>{ contract.contract_number }</div>
                </div>
                <div className="row">
                    <label>Amount:</label>
                    <div>{ payment.amount } ₽</div>
                </div>
                <div className="row">
                    <label>Scheduled date:</label>
                    <div>{ payment.scheduled_date }</div>
                </div>
            </div>
        </div>
    )
}