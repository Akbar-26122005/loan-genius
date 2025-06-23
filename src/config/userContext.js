import { useEffect, useState, createContext } from "react"
import getPath from "./serverClient"
import { Navigate } from "react-router-dom"

export const UserContext = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(getPath('/auth/check'), {
                    method: 'GET'
                    ,headers: { 'Content-Type': 'application/json' }
                    ,credentials: 'include'
                })

                const data = await response.json()
                
                if (!response.ok || !data.isAuthenticated)
                    throw new Error(data.message || 'No authenticated')

                sessionStorage.setItem('user', JSON.stringify(data.user))
                setUser(data.user)
            } catch (err) {
                sessionStorage.removeItem('user')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        if (!user) {
            checkAuth()
        } else {
            setLoading(false)
        }

    }, [])

    const value = {
        user
        ,loading
        ,setUser: (newUser) => {
            if (newUser) {
                sessionStorage.setItem('user', JSON.stringify(newUser))
            } else {
                sessionStorage.removeItem('user')
            }
            setUser(newUser)
        }
        ,logout: async () => {
            try {
                await fetch(getPath('/auth/log-out'), {
                    method: 'GET'
                    ,credentials: 'include'
                })
            } finally {
                sessionStorage.removeItem('user')
                setUser(null)
                return <Navigate to={'/auth'} replace />
            }
        }
    }

    return (
        <UserContext.Provider value={value}>
            { children }
        </UserContext.Provider>
    )
}