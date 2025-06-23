import { useNavigate } from 'react-router-dom';
import React from 'react';

function LogOut() {
    const navigate = useNavigate();

    const handleLogout = () => {
        document.body.classList.remove('dark-mode');
        
        localStorage.clear();
        navigate('/signin');
    };

    return (
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