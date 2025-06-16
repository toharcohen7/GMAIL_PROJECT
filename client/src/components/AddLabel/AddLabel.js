import React, { useState } from 'react';
import './AddLabel.css';

const AddLabel = ({ onSave, onCancel }) => {
    const [labelName, setLabelName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (labelName.trim()) {
            onSave(labelName);
        } else {
            console.log("Label name cannot be empty.");
        }
    };

    return (
        // Modal Container (Bootstrap's modal and fade classes)
        // role="dialog" and aria-labelledby are important for accessibility
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="AddLabelTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="add-screen modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="AddLabelTitle">Create New Label</h5>
                        {/* Bootstrap's close button for modals */}
                        <button type="button" className="btn-close bi bi-x-circle" aria-label="Close" onClick={onCancel}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="labelNameInput" className="form-label visually-hidden">Label Name</label>
                                <input
                                    type="text"
                                    className="form-control" // Bootstrap class for input
                                    id="labelNameInput"
                                    placeholder="Enter label name"
                                    value={labelName}
                                    onChange={(e) => setLabelName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary" // Bootstrap class for secondary button
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary" // Bootstrap class for primary button
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