import React, { useEffect, useState } from "react";
import '../styles/products.css';
import getPath from "../config/serverClient";
import { showMessage } from "./messages";

export default function Products({ user }) {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchData = async () => {
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
        }

        fetchData()
    }, [])

    return (
        <div className="Products">

        </div>
    )
}

function Product({ product }) {
    return (
        <div className="Product">
            
        </div>
    )
}