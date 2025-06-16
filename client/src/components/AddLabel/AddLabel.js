import React, { useState, useEffect } from 'react';
import './AddLabel.css';

const AddLabel = ({ onSave, onCancel, initialValue = "", title = "Create New Label" }) => {
    const [labelName, setLabelName] = useState(initialValue);

    // Update state when initialValue changes
    useEffect(() => {
        setLabelName(initialValue);
    }, [initialValue]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (labelName.trim()) {
            onSave(labelName);
        } else {
            console.log("Label name cannot be empty.");
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="AddLabelTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="add-screen modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="AddLabelTitle">{title}</h5>
                        <button type="button" className="btn-close bi bi-x-circle" aria-label="Close" onClick={onCancel}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="labelNameInput" className="form-label visually-hidden">Label Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="labelNameInput"
                                    placeholder="Enter label name"
                                    value={labelName}
                                    onChange={(e) => setLabelName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddLabel;