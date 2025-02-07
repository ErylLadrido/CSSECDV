import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
type Props = {}

export default function PrivateRoutes({}: Props) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const location = useLocation()

    if (!token) {
        // Redirect to login if no token is found
        return <Navigate to="/login" />;
    }

    if(location.pathname === '/admin' && role != "admin")
        return <Navigate to="/"/>

    // Render the protected component
    return <Outlet />;
}