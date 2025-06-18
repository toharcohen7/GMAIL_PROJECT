import React from "react";
import './SystemLabel.css';

function SystemLabel({name, badgeCount = 0, iconClass = "", onLabelClick, isSelected = false}) {
    return (
       <div className={`list-group-item d-flex justify-content-between align-items-center ${isSelected ? 'selected' : ''}`} 
             onClick={onLabelClick}>
            {iconClass && <i className={`${iconClass} me-2`}></i>}
            <div className="ms-2 me-auto">
                <div className="fw-bold">{name}</div>
            </div>
            <span className="badge text-bg">{badgeCount}</span>
        </div>
    );
}
export default SystemLabel;