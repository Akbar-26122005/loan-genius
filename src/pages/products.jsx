import React, { useEffect, useState } from "react";
import '../styles/products.css';
import getPath from "../config/serverClient";
import { showMessage } from "../components/messages";

export default function Products({ user }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

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
            { products.map(product => product && <Product key={ product.id } product={ product } />) }
        </div>
    )
}

function Product({ product }) {
    return (
        <div className="Product">
            
        </div>
    )
}