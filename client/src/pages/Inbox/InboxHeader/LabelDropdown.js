import React from 'react';

function LabelDropdown({ labels, allLabels, showDropdown, onToggleDropdown, onAddToLabel }) {
  return (
    <div className="position-relative">
      <button
        className="btn btn-circle btn-light"
        aria-label="Add to label"
        onClick={onToggleDropdown}
        title="Add to label"
        disabled={labels.length === 0}
      >
        <i className="bi bi-tag"></i>
      </button>
      
      {showDropdown && (
        <div 
          className="position-absolute bg-white border rounded shadow-sm"
          style={{ 
            top: '100%', 
            left: '0', 
            minWidth: '200px', 
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {labels.length > 0 ? (
            labels.map((label, originalIndex) => {
              const realIndex = allLabels.indexOf(label);
              return (
                <button
                  key={originalIndex}
                  className="dropdown-item btn btn-link text-start w-100 border-0 px-3 py-2"
                  style={{ backgroundColor: 'transparent' }}
                  onClick={() => onAddToLabel(label, realIndex)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {label}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-2 text-muted">No moveable labels available</div>
          )}
        </div>
      )}
    </div>
  );
}

export default LabelDropdown;