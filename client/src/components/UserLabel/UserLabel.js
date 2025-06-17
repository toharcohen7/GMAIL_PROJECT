import React, { useState, useRef, useEffect } from "react";
import './UserLabel.css';

function UserLabel({ name, iconClass, badgeCount, onActionClick }) {
    const [hovered, setHovered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const labelRef = useRef(null);
    
    // Reset the menu state when mouse enters the label
    const handleMouseEnter = () => {
        setHovered(true);
        setShowMenu(false); // Always close menu when hovering starts
    };
    
    const handleMouseLeave = () => {
        setHovered(false);
    };
    
    const handleActionClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleEdit = () => {
        onActionClick("edit", name);
        setShowMenu(false);
    };

    const handleDelete = () => {
        onActionClick("delete", name);
        setShowMenu(false);
    };

    // Global click handler to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return (
        <li
            ref={labelRef}
            className="list-group-item d-flex justify-content-between align-items-center hover-label-item"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="d-flex align-items-center label-text-wrapper">
                <i className={`${iconClass} me-3`}></i>
                <span className="fw-bold">{name}</span>
            </div>

            {hovered ? (
                <div className="position-relative" ref={menuRef}>
                    <button
                        className="btn btn-sm rounded-circle hover-label-action"
                        onClick={handleActionClick}
                    >
                        <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    
                    {showMenu && (
                        <div className="label-dropdown-menu">
                            <button className="dropdown-item" onClick={handleEdit}>
                                <i className="bi bi-pencil me-2"></i>Edit
                            </button>
                            <button className="dropdown-item" onClick={handleDelete}>
                                <i className="bi bi-trash me-2"></i>Delete
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <span className="badge hover-badge rounded-pill">{badgeCount}</span>
            )}
        </li>
    );
}

export default UserLabel;