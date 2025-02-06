import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'

// Routes
import Landing from './pages/Landing.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Register.tsx';
import AdminPanel from './pages/AdminPanel.tsx';
import UserPanel from './pages/UserPanel.tsx';
import UserProfile from './pages/UserProfile.tsx';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/register" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/admin" element={<AdminPanel/>}/>
            <Route path="/" element={<UserPanel/>}/>
            <Route path="/userprofile" element={<UserProfile/>}/>
        </Routes>
    </BrowserRouter>
)