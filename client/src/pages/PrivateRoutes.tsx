import React from 'react';
import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { startSessionTimer } from '../helpers/sessionTimer';
import SessionTimeout from '../components/SessionTimeout';

type Props = {}

export default function PrivateRoutes({}: Props) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        // Start session timeout tracking
        const cleanup = startSessionTimer(() => {
            navigate("/timeout"); // Redirect to timeout page if session expires
        });

        return cleanup; // Cleanup event listeners when component unmounts
    }, [token, navigate]);

    // Redirect to login if no token is found
    if (!token) return <Navigate to="/login" />;

    // Redirect if a non-admin tries to access admin page
    if (location.pathname === "/admin" && role !== "admin") return <Navigate to="/" />;

    // Render the protected component
    return <Outlet />;
}