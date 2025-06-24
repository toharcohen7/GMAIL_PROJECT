import React from 'react';
import { formatTimestamp } from '../InboxUtilityFunc/DateFormation';

function MessageItem({
  message,
  index,
  isSelected,
  senderName,
  onToggleSelect,
  onMailClick,
  onCompleteDraft,
  onToggleStar
}) {
  const isRead = message.onRead;
  const isDraft = message.labelName === 'Draft';

  // Handler to open draft editor without triggering message click
  const handleCompleteDraftClick = (e) => {
    e.stopPropagation();
    onCompleteDraft(message);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

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
      <div className="message-star">
        <button
          type="button"
          className="btn btn-link p-0 ms-2"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(message.id);
          }}
          aria-label="Toggle star"
        >
          <i className={message.starred ? "bi bi-star-fill text-warning" : "bi bi-star"}></i>
        </button>
      </div>
      <div className="message-sender col-md-2 text-truncate" title={senderName}>
        {senderName}
      </div>
      <div className="message-content col d-flex flex-column flex-md-row">
        <span className="message-subject me-md-2 text-truncate">
          {truncateText(message.subject || 'No Subject', 15)}
        </span>
        <span className="message-snippet text-muted small text-truncate">
          {truncateText(message.snippet || message.content || '', 70)}
        </span>
      </div>

      {/* Add the Complete Draft button only for draft emails */}
      {isDraft && (
        <div className="message-action me-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={handleCompleteDraftClick}
            title="Complete and send this draft"
          >
            <i className="bi bi-send me-1"></i>
            Complete
          </button>
        </div>
      )}

      <div className="message-time col-auto text-end small text-muted" title={message.time ? new Date(message.time).toLocaleString() : ''}>
        {formatTimestamp(message.time)}
      </div>
    </div>
  );
}

export default MessageItem;