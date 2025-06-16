import 'bootstrap/dist/css/bootstrap.min.css';
import './TopBar.css';
import React from "react";
import Search from './Search/Search';
import TopLeftLogo from './TopLeftLogo/TopLeftLogo';
import Theme_Profile from './Theme_Profile/Theme_Profile';

function TopBar({ toggleSidebar }) {
    const doSearch = (q) => {
        console.log("Searching for:", q);
    };

    return (
        <nav className="navbar navbar-expand-lg custom-navbar bg-TopBar flex-nowrap">
            <div className="container-fluid d-flex align-items-center justify-content-between flex-nowrap">
                <TopLeftLogo toggleSidebar={toggleSidebar} />
                <Search doSearch={doSearch} />
                {/* eslint-disable-next-line react/jsx-pascal-case */}
                <Theme_Profile />
            </div>
        </nav>
    );
}

export default TopBar;