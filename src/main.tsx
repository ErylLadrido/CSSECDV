import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'

// Routes
import App from './pages/UserPanel.tsx'
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import AdminPanel from './pages/AdminPanel.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/admin" element={<AdminPanel/>}/>
    </Routes>
  </BrowserRouter>,
)
