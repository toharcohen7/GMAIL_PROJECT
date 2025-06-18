import React from 'react';
import './AddLabelButton.css';

function AddLabelButton({ onClick }) {
  return (
    <button
      className="btn btn-sm add-label-btn rectangular d-flex align-items-center justify-content-center"
      title="Create New Label"
      onClick={onClick}
    >
      <i className="bi bi-plus-lg"></i>
    </button>
  );
}

export default AddLabelButton;