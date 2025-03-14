import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'

// Routes
import Landing from './pages/Landing.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import AdminPanel from './pages/AdminPanel.tsx';
import UserPanel from './pages/UserPanel.tsx';
import UserProfile from './pages/UserProfile.tsx';
import Timeout from './components/SessionTimeout.tsx'
import PrivateRoutes from './pages/PrivateRoutes.tsx'
import { Navigate } from 'react-router';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/landing" />} />
            <Route path="/landing" index element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/timeout" element={<Timeout />} />
            <Route element={<PrivateRoutes />} >
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/userpanel" element={<UserPanel />} />
                <Route path="/userprofile" element={<UserProfile />} />
            </Route>
        </Routes>
    </BrowserRouter>
)