import React, { useState } from "react";

function DarkMode(){

    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    
        document.body.classList.toggle('dark-mode');
    };

    return(
        <button onClick={toggleDarkMode} className="btn btn-outline-secondary mx-3">
            <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'}`}></i>
        </button>
    );
}

export default DarkMode;