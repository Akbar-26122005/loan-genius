import React, { useEffect, useState } from "react";
import '../styles/profile.css'
import getPath from "../config/serverClient";

export default function Profile({ user, setUser }) {
    const [passport, setPassport] = useState();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return
            try {
                const response = await fetch(getPath(`/auth/get-passport?user_id=${user.id}`))

                const data = await response.json()

                if (!response.ok || !data.success)
                    throw new Error(data.message)

                setPassport(data.passport)
            } catch (err) { }
        }

        fetchData()
    }, [])

    if (!user) return null

    return (
        <div className="Profile">

        </div>
    )
}