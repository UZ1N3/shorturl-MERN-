import React, { useEffect }  from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
// import "../Components/page.css"
import {useContext, useState} from "react"

// import ToastContext from "../Components/context/ToastContext"

const Home = ()=>{


// const {toast} = useContext(ToastContext)
const [longUrl, setLongUrl] = useState('');
const [shortUrl, setShortUrl] = useState('');
const finalUrl = 'http://localhost:8002/' + shortUrl

const history = useNavigate()
// async function populateUrlShortener(){
    
// }

const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token)
    const URL = longUrl;
    console.log(URL)
    const response = await fetch('http://localhost:8002/url',{

      method:'POST',
      headers:{
        'x-access-token':localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({
        "url": URL,
        "email": decoded.email
   })
    });

    const data = await response.json();
    if(data.status === 'ok'){
      setShortUrl(data.id)
      console.log(data.id);
    }




    // Here you would make a request to your backend to shorten the URL
    // For demonstration purposes, let's just set the short URL to a placeholder
    // const shortenedUrl = 'https://short.url/example';

    // setShortUrl(shortenedUrl);
  };
 




useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
        const user = jwtDecode(token)
        console.log(user);
        if(!user){
            localStorage.removeItem('token')
            history.replace('/login')
        }else{
            alert('welcome to url-shortener')
        }
    }
})


return (

 
<body>
<header>
        <div class="logo">URL - SHORTENER</div>
        <nav>
            <ul>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/analytics">Analytics</a></li>
            </ul>
        </nav>
    </header>

    <div className="container">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Long URL</label>
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">Shorten URL</button>
      </form>
      {shortUrl && (
        <div className="short-url">
          <p>Shortened URL:</p>
          <a href={finalUrl} target="_blank" rel="noopener noreferrer">{finalUrl}</a>
        </div>
      )}
    </div>
    <script src="script.js"></script>
    </body>

  );
} 

export default Home