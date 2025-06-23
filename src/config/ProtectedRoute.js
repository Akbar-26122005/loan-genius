import { useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { UserContext } from "./userContext"

export function ProtectedUserRoute({ children }) {
    const { user, loading } = useContext(UserContext)
    const location = useLocation()

    if (loading) return <div>Loading...</div>
    if (!user) {
        return <Navigate to={'/auth'} state={{ from: location }} replace />
    }
    if (user.is_staff)
        return <Navigate to={'/employee'} state={{ from: location }} replace />
    return <Outlet />
}

export function ProtectedEmployeeRoute({ children }) {
    const { user, loading } = useContext(UserContext)
    const location = useLocation()

    if (loading) return <div>Loading...</div>
    if (!user)
        return <Navigate to={'/auth'} state={{ from: location }} replace />
    if (!user.is_staff)
        return <Navigate to={'/'} state={{from: location}} replace />
    return <Outlet />
}