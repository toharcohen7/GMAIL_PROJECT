import 'bootstrap/dist/css/bootstrap.min.css';
import './TopBar.css';
import logo from '../../images/logo.png';
import React, { useState } from "react";
import UserCard from "../UserCard/UserCard";

function TopBar() {
    const [showCard, setShowCard] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    
        // הוספה או הסרה של מחלקה על body (או אלמנט אחר)
        document.body.classList.toggle('dark-mode');
    };

    
    return (
        <nav className="navbar navbar-expand-lg custom-navbar bg-TopBar flex-nowrap">
            <div className="container-fluid d-flex align-items-center justify-content-between flex-nowrap">

                <div className="d-flex align-items-center">
                    <button id="toggleSidebarBtn" className="btn btn-outline-secondary">
                        <i class="bi bi-list"></i>
                    </button>
                    <a className="navbar-brand" href="########## the main page path ##########">
                        <img src={logo} alt="Logo" className='logo-img' />
                    </a>
                </div>

                <div className="position-relative search-form d-none d-sm-block">
                    <i className="bi bi-search search-icon-inside"></i>
                    <input
                        type="text"
                        className="form-control search-input-with-icon"
                        placeholder="Search mail"
                    />
                </div>
                <div className="position-relative d-flex align-items-center gap-2">
                    {/* כפתור מצב כהה */}
                    <button onClick={toggleDarkMode} className="btn btn-outline-secondary mx-3">
                        <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'}`}></i>
                    </button>

                    {/* כפתור פרופיל */}
                    <button onClick={() => setShowCard(prev => !prev)} className="btn btn-outline-secondary">
                        <i className="bi bi-person-circle"></i>
                    </button>

                    {/* הכרטיס */}
                    {showCard && (
                        <div className="card user-card">
                            <UserCard />
                        </div>
                    )}
                </div>


            </div>
        </nav>
    );
}

export default TopBar;