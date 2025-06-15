import React from 'react';
import { formatTimestamp } from '../InboxUtilityFunc/DateFormation';

function MessageItem({ 
  message, 
  index, 
  isSelected, 
  senderName, 
  onToggleSelect, 
  onMailClick 
}) {
  const isRead = message.read;

  return (
    <div
      className={`message-item list-group-item list-group-item-action d-flex align-items-center ${isRead ? 'read' : 'fw-bold unread'} ${isSelected ? 'active' : ''}`}
      role="listitem"
      tabIndex={0}
      data-message-id={message.id}
      data-index={index}
      onClick={(e) => onMailClick(message, e)}
      style={{ cursor: 'pointer' }}
    >
      <div className="message-select">
        <input
          type="checkbox"
          className="form-check-input"
          id={`msg-${message.id}`}
          aria-label="Select this message"
          checked={isSelected}
          onChange={() => onToggleSelect(message.id)}
          onClick={e => e.stopPropagation()}
        />
      </div>
      <div className="message-sender col-md-2 text-truncate" title={senderName}>
        {senderName}
      </div>
      <div className="message-content col d-flex flex-column flex-md-row">
        <span className="message-subject me-md-2 text-truncate">
          {message.subject || 'No Subject'}
        </span>
        <span className="message-snippet text-muted small text-truncate">
          {message.snippet || message.content || ''}
        </span>
      </div>
      <div className="message-time col-auto text-end small text-muted" title={message.time ? new Date(message.time).toLocaleString() : ''}>
        {formatTimestamp(message.time)}
      </div>
    </div>
  );
}

export default MessageItem;