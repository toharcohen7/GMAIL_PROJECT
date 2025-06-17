import 'bootstrap/dist/css/bootstrap.min.css';
import './TopBar.css';
import React, { useState } from "react";
import Search from './Search/Search';
import TopLeftLogo from './TopLeftLogo/TopLeftLogo';
import Theme_Profile from './Theme_Profile/Theme_Profile';
import CreateMail from './CreateMail/CreateMail';

function TopBar() {
    const actualUserId = localStorage.getItem("user-id");
    const [searchQuery, setSearchQuery] = useState('');
    const [mailList, setMailList] = useState([]);

    const doSearch = (q) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }
        
        fetch(`http://localhost:12345/api/mails/search/${encodeURIComponent(q)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'user-id': actualUserId,
            },
        })
        .then((res) => {
            if (!res.ok) throw new Error("Error fetching mails");
            return res.json();
        })
        .then((data) => {
            setSearchQuery(q);
            setMailList(data);
        })
        .catch((err) => {
            console.error("Search failed:", err.message);
        });
    };

    return (
        <nav className="navbar navbar-expand-lg custom-navbar bg-TopBar flex-nowrap">
            <div className="container-fluid d-flex align-items-center justify-content-between flex-nowrap">

                <TopLeftLogo />
                <Search doSearch = {doSearch}/>
                <Theme_Profile />


            </div>
        </nav>
    );
}

export default TopBar;