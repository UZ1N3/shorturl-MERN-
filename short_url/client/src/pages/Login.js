import React, { useState } from 'react';
import '../App.css';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

// login fn

 async function loginUser(event){
    event.preventDefault();
    const response = await fetch('http://localhost:8002/api/login',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
       
    });
  
    const data = await response.json();

    if(data.user){
        localStorage.setItem('token',data.user)
        alert('Login Successful')
        window.location.href= '/home'
    }else{
        alert('please check your credentials')
    }
    console.log(data);
  }

  //login html

  return (
    <div className="container">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={loginUser}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?
          <span className="toggle-btn">Register here</span>
        </p>
      </div>
    </div>
  );
};

export default App;
