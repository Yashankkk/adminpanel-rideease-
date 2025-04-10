// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
// import App from './App';
import AdminPanel from './Pages/adminpanel';
import User from './Pages/user';
import Contact from './Pages/contact';

// import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <div>
    <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<App />} /> */}
      <Route path="/" element={<AdminPanel />} />
      <Route path="/user" element={<User />} />
      <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  </div>
  
)
