import 'bootstrap/dist/css/bootstrap.min.css';
import './SideBar.css';
import '../Label/Label.css';
import React from "react";
import Label from '../Label/Label.js';


function SideBar() {
    return (

        <div className="container-fluid">
            <div className="row">
                <div className="bg-light sidebar">
                    <ol className="list-group">
                        <Label />
                        <button className="list-group-item d-flex justify-content-between align-items-start">
                            <i className="bi bi-send me-2"></i>
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Sent</div>
                            </div>
                            <span className="badge text-bg">14</span>
                        </button>
                        <button className="list-group-item d-flex justify-content-between align-items-start">
                            <i className="bi bi-file-earmark me-2"></i>
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Draft</div>
                            </div>
                            <span className="badge text-bg">14</span>
                        </button>
                    </ol>
                </div>
            </div>
        </div>

    );
}

export default SideBar;