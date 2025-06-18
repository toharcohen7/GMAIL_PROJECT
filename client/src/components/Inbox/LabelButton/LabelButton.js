import React, { useState, useRef, useEffect } from 'react';

const LabelButton = ({ availableLabels = [], onMoveToLabel }) => {
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
        onClick={() => setShowLabelDropdown(!showLabelDropdown)}
        title="Move to label"
      >
        <i className="bi bi-tag"></i>
      </button>
      
      {showLabelDropdown && (
        <div className="position-absolute bg-white border rounded shadow-sm"
          style={{ 
            top: '100%', 
            left: '0', 
            minWidth: '200px', 
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
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