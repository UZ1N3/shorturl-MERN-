
import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function App() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function registerUser(event){
    
    event.preventDefault();
    const response = await fetch('http://localhost:8002/api/register',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
       
    });
  
    const data = await response.json();
    if(data.status === 'ok'){
      navigate('/login')
    }
    console.log(data);
   }

  return (
    <div className="container">
      <div className="auth-container">
        <h2>Register</h2>
        <form onSubmit={registerUser}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account?
          <span className="toggle-btn">Login here</span>
        </p>
      </div>
    </div>
  );



  
}

export default App;
