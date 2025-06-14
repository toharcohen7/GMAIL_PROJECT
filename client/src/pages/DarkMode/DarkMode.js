import React, { useState } from "react";

function DarkMode(){

    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    
        // הוספה או הסרה של מחלקה על body (או אלמנט אחר)
        document.body.classList.toggle('dark-mode');
    };

    return(
        <button onClick={toggleDarkMode} className="btn btn-outline-secondary mx-3">
            <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'}`}></i>
        </button>
    );
}

export default DarkMode;