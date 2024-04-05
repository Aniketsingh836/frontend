import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [key, setKey] = useState('');
  const [expiryTimeFrame, setExpiryTimeFrame] = useState('1');
  const [userData, setUserData] = useState([]);

  const handleExpiryTimeFrameChange = (e) => {
    setExpiryTimeFrame(e.target.value);
  };

  const fetchAllUserData = async () => {
    try {
      const response = await axios.get('https://backend-eight-swart.vercel.app/api/user');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchAllUserData();
  }, []);

  const postUserData = async (username, key) => {
    try {
      const userDataResponse = await axios.post('https://backend-eight-swart.vercel.app/api/generate', {
        username: username,
        key: key,
        expiry: expiryTimeFrame
      });
      
      console.log('User data POST response:', userDataResponse.data);
      fetchAllUserData();
    } catch (error) {
      console.error('Error posting user data:', error);
    }
  };

  const deleteUser = async (username) => {
    try {
      const response = await axios.delete(`https://backend-eight-swart.vercel.app/api/user/${username}`);
      console.log(response.data.message);
      fetchAllUserData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const generateUserData = () => {
    const randomUsername = 'User_' + Math.floor(Math.random() * 1000);
    setUsername(randomUsername);
    const randomKey = Math.random().toString(36).substring(7);
    setKey(randomKey + ' (Expires in ' + expiryTimeFrame + ')');
    postUserData(randomUsername, randomKey);
  };

  return (
    <div className="App">
      <div className="input-container1">
      <h1>User Creation</h1>
        <label className="label">Expiry Time Frame:</label>
        <select value={expiryTimeFrame} onChange={handleExpiryTimeFrameChange}>
          <option value="1">1</option>
          <option value="3">3</option>
          <option value="7">7</option>
        </select>
      </div>
      <div className="input-container">
        <label className="label">Username:</label>
        <span className="info">{username}</span>
      </div>
      <div className="input-container">
        <label className="label">Key:</label>
        <span className="info">{key}</span>
      </div>
      <button className="button" onClick={generateUserData}>Generate Username & Key</button>
      
      <table className='table-container'>
        <thead>
          <tr>
            <th>Username</th>
            <th>Key</th>
            <th>Action</th> {/* Add new header for action */}
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.key}</td>
              <td><button onClick={() => deleteUser(user.username)}>Delete</button></td> {/* Delete button */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
