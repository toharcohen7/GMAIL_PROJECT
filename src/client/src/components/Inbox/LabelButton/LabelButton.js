import React, { useState, useRef, useEffect } from 'react';
import { FetchWithAuth } from '../../FetchWithAuth/FetchWithAuth';
import { buildApiUrl } from '../../../config/api';

const LabelButton = ({ onMoveToLabel, currentLabel }) => {
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);
  const [availableLabels, setAvailableLabels] = useState([]);
  const dropdownRef = useRef(null);

  // Function to fetch labels
  const fetchLabels = async () => {
    try {
      const response = await FetchWithAuth(buildApiUrl('/api/labels'));
      if (response.ok) {
        const data = await response.json();
        // Filter out system labels and current label
        const filteredLabels = data.filter(label =>
          !['Draft', 'Sent', 'Trash', 'Spam', 'Starred'].includes(label.name) &&
          label.name !== currentLabel
        );
        setAvailableLabels(filteredLabels);
      }
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  // Toggle dropdown and fetch fresh labels when opening
  const handleToggleDropdown = async () => {
    if (!showLabelDropdown) {
      // Fetch fresh labels when opening the dropdown
      await fetchLabels();
    }
    setShowLabelDropdown(!showLabelDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLabelDropdown(false);
      }
    }

    if (showLabelDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLabelDropdown]);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        className="btn btn-circle btn-light"
        aria-label="Move to label"
        onClick={handleToggleDropdown}
        title="Move to label"
      >
        <i className="bi bi-tag"></i>
      </button>

      {showLabelDropdown && (
        <div className="label-dropdown-menu position-absolute border rounded shadow-sm"
          style={{
            top: '100%',
            left: '0',
            minWidth: '200px',
            zIndex: 1000
          }}>

          {availableLabels && availableLabels.length > 0 ? (
            availableLabels.map((label, index) => (
              <button
                key={index}
                className="dropdown-item btn btn-link text-start w-100 border-0 px-3 py-2"
                style={{ backgroundColor: 'transparent' }}
                onClick={() => {
                  onMoveToLabel(label.name);
                  setShowLabelDropdown(false);
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {label.name}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-muted">No labels available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LabelButton;