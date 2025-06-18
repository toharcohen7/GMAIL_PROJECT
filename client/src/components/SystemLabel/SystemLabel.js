import React, { useState } from 'react';
import './SystemLabel.css';
import BlacklistRemoveButton from '../SideBar/Buttons/BlacklistRemoveButton/BlacklistRemoveButton';

function SystemLabel({name, badgeCount = 0, iconClass = "", onLabelClick, isSelected = false}) {
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
      
      <div>
        {isSpamLabel && isHovered ? (
          <BlacklistRemoveButton />
        ) : (
          <span className="badge bg-secondary">{badgeCount}</span>
        )}
      </div>
    </div>
  );
}

export default SystemLabel;