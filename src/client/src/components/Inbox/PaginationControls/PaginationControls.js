import React from 'react';
import './PaginationControls.css';
import { FetchWithAuth } from '../../FetchWithAuth/FetchWithAuth';
import { buildApiUrl } from '../../../config/api';

function PaginationControls({ offset, setOffset, loadMessages, selectedLabel }) {
  const handleNext = async () => {
    const res = await FetchWithAuth(buildApiUrl(`/api/mails?labelName=${encodeURIComponent(selectedLabel)}&offset=${offset + 50}`));
    if (!res.ok) throw new Error('Failed to load messages');
    const data = await res.json();
    if (data.length > 0) {
      setOffset(prevOffset => prevOffset + 50);
      loadMessages();
    }
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
      <span className="offset-display ml-2 mt-2">
        Page {(offset / 50) + 1}
      </span>
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