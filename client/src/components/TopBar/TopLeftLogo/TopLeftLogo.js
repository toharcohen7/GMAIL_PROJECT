import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../images/logo.png';
import CreateMail from '../CreateMail/CreateMail';

function TopLeftLogo() {
  return (
    <div className="d-flex align-items-center">
      <button id="toggleSidebarBtn" className="btn btn-outline-secondary">
        <i className="bi bi-list"></i>
      </button>
      <Link className="navbar-brand" to="/mainpage">
        <img src={logo} alt="logo" className="logo-img" />
      </Link>
      <CreateMail />
    </div>
  );
}

export default TopLeftLogo;