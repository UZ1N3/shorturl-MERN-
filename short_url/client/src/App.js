import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';

import{BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from  './pages/Login'
import Register from  './pages/Register'
import Home from './pages/Home'
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';

const App = ()=> {
    return <div>

        <BrowserRouter>
            <Routes>
            <Route path= "/login"  element ={<Login />} />
            <Route path= "/register"  element ={<Register />} />
            <Route path= "/home"  element ={<Home />} />
            <Route path= "/analytics"  element ={<Analytics />} />
            <Route path= "/dashboard"  element ={<Dashboard />} />
            </Routes>
            
        </BrowserRouter>
    </div>
}
export default App