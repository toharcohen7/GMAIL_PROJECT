import React, { useState } from 'react';
import './SystemLabel.css';
import BlacklistRemoveButton from '../Buttons/BlacklistRemoveButton/BlacklistRemoveButton';

function SystemLabel({ name, badgeCount, iconClass, onLabelClick, isSelected }) {
  const [isHovered, setIsHovered] = useState(false);
  const isSpamLabel = name.toLowerCase() === 'spam';

  return (
    <div
      className={`list-group-item d-flex justify-content-between align-items-center ${isSelected ? 'active' : ''}`}
      onClick={onLabelClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="d-flex align-items-center">
        {iconClass && <i className={`${iconClass} me-2`}></i>}
        <span>{name}</span>
      </div>

      <div className="label-action-slot">
        {isSpamLabel ? (
          <>
            <span className={`badge bg-secondary ${isHovered ? 'hidden' : ''}`}>
              {badgeCount}
            </span>
            <div className={`remove-btn-wrapper ${isHovered ? 'visible' : ''}`}>
              <BlacklistRemoveButton />
            </div>
          </>
        ) : (
          typeof badgeCount === 'number' && (
            <span className="badge bg-secondary">{badgeCount}</span>
          )
        )}
      </div>


    </div>
  );
}

export default SystemLabel;