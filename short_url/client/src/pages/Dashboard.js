

import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { jwtDecode } from "jwt-decode";
import io from 'socket.io-client';

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [newShortId, setNewShortId] = useState('');
  const [editingId, setEditingId] = useState(null);

// fetch urls on page oppening
  useEffect(() => {
    showUrls();
    
  const intervalId = setInterval(showUrls, 5000); // Fetch data every 5 seconds

  return () => clearInterval(intervalId); 
  }, []);

  //automatically update the data

  useEffect(() => {
    const socket = io(); // Connect to WebSocket server
  
    socket.on('recordUpdated', (updatedRecord) => {
      setRecords(records.map(record => (record._id === updatedRecord._id ? updatedRecord : record)));
    });
  
    return () => socket.disconnect(); // Cleanup function to disconnect WebSocket when the component unmounts
  }, []);

// handleSave
  const handleSave = async (id) => {
    try {
      const response = await fetch('http://localhost:8002/edit/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, shortId: newShortId }), // Send the record ID and new shortId in the request body
      });
      if (!response.ok) {
        throw new Error('Failed to edit record');
      }
      const updatedRecord = await response.json();
      // Update the state with the updated record
      setRecords(records.map(record => (record._id === id ? updatedRecord : record)));
      console.log('Record updated successfully');
      // Reset editing state
      setEditingId(null);
      setNewShortId('');
    } catch (error) {
      console.error('Error editing record:', error);
    }
  };

  //handle Delete

  const handleDelete = async (id) => {
    try {
      const response = await fetch('http://localhost:8002/delete/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Send the record ID in the request body
      });
      if (!response.ok) {
        throw new Error('Failed to delete record');
      }
      // Remove the deleted record from the state
      setRecords(records.filter(record => record._id !== id));
      console.log('Record deleted successfully');
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  // handle edit

  const handleEdit = (id, shortId) => {
    setEditingId(id);
    setNewShortId(shortId);
  };



// show url on page load

const showUrls = async () => {
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


//component
 
return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {records.map((record, index) => (
          <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px', position: 'relative' }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>Short URL:</strong> localhost:8002/{record.shortId}
            </div>
            <div style={{ position: 'absolute', right: '0', top: '0', marginRight: '10px' }}>
              {/* Edit icon */}
              {editingId === record._id ? (
                <React.Fragment>
                  <input
                    type="text"
                    value={newShortId}
                    onChange={(e) => setNewShortId(e.target.value)}
                    style={{ marginRight: '10px' }}
                  />
                  <button onClick={() => handleSave(record._id)}>Save</button>
                </React.Fragment>
              ) : (
                <span style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => handleEdit(record._id, record.shortId)}>
                  <i className="fas fa-edit" style={{ color: 'blue' }}></i>
                </span>
              )}
              {/* Delete icon */}
              <span style={{ cursor: 'pointer' }} onClick={() => handleDelete(record._id)}>
                <i className="fas fa-trash-alt" style={{ color: 'red' }}></i>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;











