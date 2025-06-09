import React, { useEffect, useState } from "react";
import '../styles/loan.css'
import getPath from "../config/serverClient";
import { showMessage } from "./messages";
import { useParams } from "react-router-dom";

export default function Loan() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [reload, setReload] = useState(true)
    const [loan, setLoan] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(getPath(`/loans/get?id=${id}`), {
                    method: 'GET'
                    ,headers: { 'Content-Type': 'application/json' }
                    ,credentials: 'include'
                })
                const data = await response.json()

                if (!response.ok || !data.success)
                    throw new Error(data.message)

                setLoan(data.loan)
                setLoading(false)
            } catch (err) {
                showMessage(err.message, 'error-message')
            }
        }

        fetchData()
    }, [id, reload])

    if (loading) return (
        <div className="loading">Loading...</div>
    )

    return (
        <div className="Loan">
            <h2>Loan</h2>
            <div className="row">
                <label>Product name:</label>
                <div>{ loan.applications.credit_products.name }</div>
            </div>
            <div className="row">
                <label>Amount</label>
                <div>{ loan.final_amount }</div>
            </div>
            <div className="row">
                <label>Term</label>
                <div>{ `${loan.final_term} month` }</div>
            </div>
            <div className="row">
                <label>Rate</label>
                <div>{ `${loan.final_rate}% yearly` }</div>
            </div>
            <div className="row">
                <label>Disbursement Date</label>
                <div>{ loan.disbursement_date || '---' }</div>
            </div>
            <div className="row">
                <label>Account Number</label>
                <div>{ loan.account_number }</div>
            </div>
        </div>
    )
}