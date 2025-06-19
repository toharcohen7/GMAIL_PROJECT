import React, { useState } from 'react';
import './BlacklistRemoveButton.css';
import BlacklistDeleteDialog from '../BlacklistDeleteDialog/BlacklistDeleteDialog';

function BlacklistRemoveButton() {
  const [showDialog, setShowDialog] = useState(false);

  // Stop event propagation so label click isn't triggered
  const handleButtonClick = (e) => {
    e.stopPropagation();
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <>
      <button
        className="blacklist-remove-btn"
        onClick={handleButtonClick}
        title="Remove URL from blacklist"
      >
        <i className="bi bi-shield-slash"></i>
      </button>
      
      {showDialog && <BlacklistDeleteDialog onClose={handleCloseDialog} />}
    </>
  );
}

export default BlacklistRemoveButton;