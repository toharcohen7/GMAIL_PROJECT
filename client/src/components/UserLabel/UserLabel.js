import React, { useState } from "react";
import './UserLabel.css';

function UserLabel({ name, iconClass, badgeCount, onActionClick }) {
    const [hovered, setHovered] = useState(false);

    return (
        <li
            className="list-group-item d-flex justify-content-between align-items-center hover-label-item"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="d-flex align-items-center label-text-wrapper">
                <i className={`${iconClass} me-3`}></i>
                <span className="fw-bold">{name}</span>
            </div>

            {hovered ? (
                <button
                    className="btn btn-sm rounded-circle hover-label-action"
                    onClick={() => onActionClick(name)}
                >
                    <i className="bi bi-three-dots-vertical"></i>
                </button>
            ) : (
                <span className="badge hover-badge rounded-pill">{badgeCount}</span>
            )}
        </li>

    );
}

export default UserLabel;