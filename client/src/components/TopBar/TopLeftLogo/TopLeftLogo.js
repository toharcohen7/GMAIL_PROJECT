import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../images/logo.png';

function TopLeftLogo({ toggleSidebar }) {
  return (
    <div className="d-flex align-items-center">
      <button 
        id="toggleSidebarBtn" 
        className="btn btn-outline-secondary"
        onClick={toggleSidebar}
        title="Toggle sidebar"
      >
        <i className="bi bi-list"></i>
      </button>
      <Link className="navbar-brand" to="/mainpage">
        <img src={logo} alt="logo" className="logo-img" />
      </Link>
    </div>
  );
}

export default TopLeftLogo;
