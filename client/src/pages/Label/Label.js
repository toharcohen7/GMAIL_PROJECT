import React from "react";
import './Label.css';


function Label() {
    return (
        <button className="list-group-item d-flex justify-content-between align-items-start">
            <i className="bi bi-inbox-fill me-2"></i>
            <div className="ms-2 me-auto">
                <div className="fw-bold">Inbox</div>
            </div>
            <span className="badge text-bg">14</span>
        </button>
    );
}
export default Label;