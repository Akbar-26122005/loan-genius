import React, { useContext, useEffect, useState } from "react";
import '../styles/products.css';
import getPath from "../config/serverClient";
import { showMessage } from "../components/messages";
import { UserContext } from "../config/userContext";

export default function Products() {
    const { user } = useContext(UserContext)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch(getPath('/products/get-all'), {
                    method: 'GET'
                    ,headers: { 'Content-Type': 'application/json' }
                    ,credentials: 'include'
                })
                const data = await response.json()

                if (!response.ok || !data.success)
                    throw new Error(data.message)

                setProducts(data.credit_products)
            } catch (err) {
                showMessage(err.messagem, 'error-message')
            }
            setLoading(false)
        }

        fetchData()
    }, [])

    return loading ? null : (
        <div className="Products">
            <div className="title">Products</div>
            { products.map(product =>
                product.is_active &&
                <Product
                    key={ product.id }
                    product={ product }
                    onClick={ () => setForm(<Form product={ product } isClosed={ () => setForm(null) } />) }
                />)
            }

            { form && form }
        </div>
    )
}

function Product({ product, onClick }) {

    const handleClick = e => {
        onClick(e)
    }

    const handleCreateApplication = async () => {
        try {
            const response = await fetch(getPath('/applications/create'), {
                method: 'POST'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
            })
            const data = await response.json()

            if (!response.ok || !data.success)
                throw new Error(data.message)
        } catch (err) {
            showMessage(err.message, 'error-message')
        }
    }

    return (
        <div className="Product" onClick={ handleClick }>
            <div className="row first">
                <div className="row name">{ product.name }</div>
                <div className="row description">{ product.description }</div>
            </div>
            <div className="row amount">{ `Amount ${product.min_amount} - ${product.max_amount}` }</div>
            <div className="row last">
                <div className="row rate">{ `Base rate ${product.base_rate}` }</div>
                <div className="row term">{ `Term ${product.min_term} - ${product.max_term} months` }</div>
                <div className="row early_repayment">{ `The possibility of early repayment: ${product.early_repayment ? 'yes' : 'no'}` }</div>
            </div>
        </div>
    )
}

function Form({ product, isClosed }) {
    const { user } = useContext(UserContext)
    const [amount, setAmount] = useState()
    const [rate, setRate] = useState()
    const [term, setTerm] = useState()
    const [purpose, setPurpose] = useState('specified purpose')

    const close = e => {
        if (e.target.className.includes('Form')) {
            isClosed()
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(getPath('/applications/create'), {
                method: 'POST'
                ,headers: { 'Content-Type': 'application/json' }
                ,credentials: 'include'
                ,body: JSON.stringify({
                    user_id: user.id
                    ,product_id: product.id
                    ,created_at: new Date()
                    ,updated_at: new Date()
                    ,decision_date: null
                    ,purpose: purpose
                    ,rate: rate
                    ,term: term
                    ,status: 'pending'
                    ,amount: amount
                })
            })
            const data = await response.json()

            if (!response.ok || !data.success)
                throw new Error(data.message)

            window.location.replace('/mybank')
            showMessage('The application has been sent')
        } catch (err) {
            showMessage(err.message, 'error-message')
            console.log(err.message)
        }
    }

    return (
        <div className="Form" onClick={ close }>
            <form onSubmit={ e => handleSend(e) }>
                <div className="rows">
                    <div className="row">
                        <label>Amount</label>
                        <input required
                            className={ (amount < product.min_amount || amount > product.max_amount) ? 'error' : '' }
                            type="number"
                            placeholder={ `  ${product.min_amount} - ${product.max_amount}` }
                            value={ amount }
                            onChange={ e => setAmount(Number(e.target.value).toFixed(0)) }
                        />
                    </div>
                    <div className="row">
                        <label>Rate</label>
                        <input required
                            className={ rate < product.base_rate ? 'error' : '' }
                            type="number"
                            placeholder={ `  base ${product.base_rate}` }
                            value={ rate }
                            onChange={ e => setRate(parseFloat(e.target.value)) }
                        />
                    </div>
                    <div className="row">
                        <label>Term</label>
                        <input required
                            className={ (term < product.min_term || term > product.max_term) ? 'error' : '' }
                            type="number"
                            placeholder={ `  ${product.min_term} - ${product.max_term}` }
                            value={ term }
                            onChange={ e => setTerm(Number(e.target.value).toFixed(0)) }
                        />
                    </div>
                    <div className="row">
                        <label>Purpose</label>
                        <textarea required
                            className={ !purpose ? 'error' : '' }
                            type="text"
                            value={ purpose }
                            onChange={ e => setPurpose(e.target.value) }
                        />
                    </div>
                </div>
                <button type="submit" className="send-btn" onClick={ handleSend }>Send</button>
            </form>
        </div>
    )
}