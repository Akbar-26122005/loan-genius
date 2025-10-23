import React, { useState, useContext, useEffect } from "react"
import { UserContext } from "../../config/userContext"
import getPath, { getDateFromTimestamp } from "../../config/serverClient"
import { showMessage } from "../../components/messages"
import Loading from "../../components/loading"

export default function Form({ payment, onClose }) {
    const { user } = useContext(UserContext)
    const [contract, setContract] = useState(null)
    const [loading, setLoading] = useState(null)

    const [amount, amountChange] = useState(payment.amount)
    const [paidDate, paidDateChange] = useState(getDateFromTimestamp(new Date()))

    useEffect(() => {
        setLoading(true)
        try {
            const contracts = user.applications
                .flatMap((appl) => appl.loans)
                .flatMap((loan) => loan.contracts)
            
            const contract = contracts.reduce((acc, curr) => 
                curr.payments.includes(payment) ? curr : acc
            )
            
            setContract(contract)
        } finally {
            setLoading(false)
        }
    }, [user])

    const handleCloseForm = e => {
        if (e.target.className.includes('payment-form')) {
            // selectedPaymentChange(null)
            onClose()
        }
    }

    const handlePay = async () => {
        try {
            const response = await fetch(getPath('/payments/to-pay'), {
                method: 'POST'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
                ,body: JSON.stringify({
                    id: payment.id
                    ,amount: payment.amount
                    ,paid_date: paidDate
                })
            })
            const result = await response.json()

            if (!response.ok || !result.success) {
                console.log(result.message)
                throw new Error(
                    !response.ok ? 'Database error' : result.message
                )
            }
        } catch (err) {
            showMessage(err.message)
        } finally {
            onClose()
        }

    }

    if (loading) return <Loading />
    if (!contract) return null

    return (
        <div className="payment-form" onClick={ handleCloseForm }>
            <div className="form">
                <div className="row">
                    <label>Contract number</label>
                    <input
                        type="text"
                        value={ contract.contract_number }
                        readOnly
                        disabled
                    />
                </div>
                <div className="row">
                    <label>Scheduled date</label>
                    <input
                        type="text"
                        value={ payment.scheduled_date }
                        readOnly
                        disabled
                    />
                </div>
                <div className="row">
                    <label>Paid date</label>
                    <input
                        type="text"
                        value={ paidDate }
                        disabled
                        readOnly
                    />
                </div>
                <div className="row">
                    <label>Total amount*</label>
                    <input
                        type="number"
                        value={ amount }
                        disabled
                        readOnly
                        // onChange={ e => {
                        //     const value = e.target.value
                        //     let valueStr = String(value)
                        //     let length = valueStr.length

                        //     const inc_dot = valueStr.includes('.')
                        //     if (inc_dot && length - valueStr.indexOf('.') - 1 > 2) {
                        //         const valueArr = valueStr.split('')
                        //         valueArr[length - 1] = ''
                        //         valueStr = valueArr.join('')
                        //         length = valueStr.length
                        //     }

                        //     valueStr = inc_dot
                        //         ? `${Number(valueStr.split('.')[0])}.${valueStr.split('.')[1]}`
                        //         : `${Number(valueStr)}`
                        //     amountChange(valueStr)
                        // } }
                        // inputMode="numeric"
                        // placeholder={ `${ payment.amount }` }
                    />
                </div>
                <button onClick={ handlePay }>To pay</button>
            </div>
        </div>
    )
}
