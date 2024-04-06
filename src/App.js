import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [key, setKey] = useState('');
  const [expiryTimeFrame, setExpiryTimeFrame] = useState('1');
  const [userData, setUserData] = useState([]);
  const [copiedData, setCopiedData] = useState(null);

  const copyUserData = (username, key) => {
    const dataToCopy = `${username}: ${key}`;
    navigator.clipboard.writeText(dataToCopy)
      .then(() => setCopiedData(dataToCopy))
      .catch((error) => console.error('Failed to copy:', error));
  };

  const handleExpiryTimeFrameChange = (e) => {
    setExpiryTimeFrame(e.target.value);
  };

  const fetchAllUserData = async () => {
    try {
      const response = await axios.get('https://server-j98j.onrender.com/api/user');
      const modifiedUserData = response.data.map(user => {
        const expiresInMs = new Date(user.expires_in).getTime() - Date.now();
        const expiresInDays = Math.ceil(expiresInMs / (1000 * 60 * 60 * 24));
        return { ...user, expiresInDays };
      });
      setUserData(modifiedUserData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchAllUserData();
  }, []);


  useEffect(() => {
    fetchAllUserData();
  }, []);

  const postUserData = async (username, key) => {
    try {
      const currentDate = new Date(); // Get current date and time
      const userDataResponse = await axios.post('https://server-j98j.onrender.com/api/generate', {
        username: username,
        key: key,
        expiry: expiryTimeFrame,
        generated_at: currentDate, // Convert date to string
      });
      
      console.log('User data POST response:', userDataResponse.data);
      fetchAllUserData();
    } catch (error) {
      console.error('Error posting user data:', error);
    }
  };
  
  const deleteUser = async (username) => {
    try {
      const response = await axios.delete(`https://server-j98j.onrender.com/api/user/${username}`);
      console.log(response.data.message);
      fetchAllUserData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const generateUserData = () => {
    const randomUsername = 'user_' + Math.floor(Math.random() * 10000);
    setUsername(randomUsername);
    const randomKey = Math.random().toString(36).substring(7);
    setKey(randomKey + ' (Expires in ' + expiryTimeFrame + ')');
    postUserData(randomUsername, randomKey);
  };


  const sortedUserData = [...userData].sort((a, b) => {
    if (a.generated_at && b.generated_at) {
      return new Date(b.generated_at) - new Date(a.generated_at);
    }
    return 0;
  });

  const getRowColor = (expiresInDays) => {
    let colorClass = '';
    switch (expiresInDays) {
      case 1:
        colorClass = 'yellow-row';
        break;
      case 3:
        colorClass = 'blue-row';
        break;
      case 7:
        colorClass = 'red-row';
        break;
      default:
        colorClass = '';
        break;
    }
    return colorClass;
  };
  

  return (
    <div className="App">
      <div className="input-container1">
        <h1>User Creation</h1>
        <label className="label">Choose Time Duration:</label>
        <select className="dropdown" value={expiryTimeFrame} onChange={handleExpiryTimeFrameChange}>
          <option className="dropdown-option" value="1">1</option>
          <option className="dropdown-option" value="3">3</option>
          <option className="dropdown-option" value="7">7</option>
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
      <button className="button" onClick={generateUserData}>Generate Key</button>
      <div className='table-div'>
       <table className='table-container'>
        <thead>
          <tr>
            <th>Username</th>
            <th>Key</th>
            <th>Generated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {sortedUserData.map((user, index) => (
    <tr key={index} className={getRowColor(user.expiresInDays)}>
      <td>{user.username} ({user.expiresInDays})</td>
      <td>{user.key}</td>
      <td>{user.generated_at ? new Date(user.generated_at).toLocaleString() : ''}</td>
      <td>
        <button className='copy' onClick={() => copyUserData(user.username, user.key)}>Copy</button>
        <button onClick={() => deleteUser(user.username)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
      </div>
    </div>
  );
}

export default App;
