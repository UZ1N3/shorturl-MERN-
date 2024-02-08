

import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const Analytics = () => {
  const [records, setRecords] = useState([]);


  useEffect(() => {
    showAnalytics();
  }, []);


const showAnalytics = async () => {
    // e.preventDefault();
    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token)

    const response = await fetch('http://localhost:8002/analytics',{

    method:'POST',
    headers:{
      
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        "email": decoded.email
    })
    });

    const data = await response.json();

    
        setRecords(data);
        console.log(data)
      



}



 


return (
    <div>
      <h2> URL Analytics</h2>
      <ul>
        {records.map((record, index) => (
          <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>Short URL:</strong> localhost:8002/{record.shortId}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>User Email address:</strong> {record.userEmail}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Redirect URL:</strong> {record.redirectURL}
            </div>
            {record.visitHistory && record.visitHistory.length > 0 && (
              <div>
                <h3>Visited History:</h3>
                <ul>
                  {record.visitHistory.map((visit, idx) => (
                    <li key={idx}>{new Date(visit.timestamp).toLocaleString()}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Analytics;











