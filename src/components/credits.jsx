import React, { useEffect, useState } from "react";
import '../styles/credits.css'
import getPath from "../config/serverClient";
import { showMessage } from "./messages";
import { useNavigate } from "react-router-dom";

export default function Credits({ user }) {
    const [loans, setLoans] = useState([])

    useEffect(() => {
        const fetchData = async () => {
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
                showMessage(err.message, 'error-message')
            }
        }

        fetchData()
    }, [])

    return (
        <div className="Credits">
            <h2>Loans</h2>
            {
                loans.map(loan => 
                    <LoanTile
                        key={ loan.id }
                        loan={ loan.loans }
                        product={ loan.credit_products }
                    />
                )
            }
        </div>
    )
}

function LoanTile({ loan, product }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/loan/${loan.id}`)
    }

    return (
        <div className="loan-tile" onClick={ handleClick }>
            <h3>{ product.name }</h3>
            <h4>{ `${loan.final_amount}₽` }</h4>
        </div>
    )
}