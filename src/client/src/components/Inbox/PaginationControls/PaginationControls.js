import React from 'react';
import './PaginationControls.css';

function PaginationControls({ offset, setOffset, loadMessages }) {
  const handleNext = () => {
    setOffset(prevOffset => prevOffset + 50);
    loadMessages();
  };

  const handlePrevious = () => {
    if (offset > 0) {
      setOffset(prevOffset => Math.max(prevOffset - 50, 0));
      loadMessages();
    }
  };

  return (
    <div className="pagination-controls">
      <button
        className="btn btn-circle btn-light ml-3 mt-1"
        aria-label="Previous"
        onClick={handlePrevious}
        disabled={offset === 0}
      >
        <i className="bi bi-chevron-left"></i>
      </button>
      <button
        className="btn btn-circle btn-light ml-3 mt-1"
        aria-label="Next"
        onClick={handleNext}
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
}

export default PaginationControls;