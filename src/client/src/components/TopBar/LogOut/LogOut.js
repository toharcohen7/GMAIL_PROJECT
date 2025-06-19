import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

function LogOut(){
    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [selectedMessages, setSelectedMessages] = useState(new Set());
    const [labels, setLabels] = useState([]);
    const [senderCache, setSenderCache] = useState(new Map());
    const [error, setError] = useState(null);
    const navigate = useNavigate();



    const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setMessages([]);
    setSelectedMessages(new Set());
    setLabels([]);
    setSenderCache(new Map());
    setError(null);
    navigate('/signin');
  };

    return(
        <div className="d-flex align-items-center">
        <button
          className="btn btn-outline-secondary btn-sm mx-1"
          onClick={handleLogout}
          title="Sign out"
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    );
}

export default LogOut; 