import React from 'react';
import LabelDropdown from './LabelDropdown';

function InboxHeader({
  messages,
  selectedMessages,
  hasSelectedMessages,
  onSelectAll,
  onDeselectAll,
  onRefresh,
  onMarkAllRead,
  onDeleteSelected,
  onMarkAsSpam,
  labels,
  showLabelDropdown,
  setShowLabelDropdown,
  onAddToLabel
}) {
  const selectableLabels = labels.filter(label => {
    const lowerLabel = label.toLowerCase();
    return lowerLabel !== 'sent' && lowerLabel !== 'draft';
  });

  return (
    <div className="inbox-header card-header bg-light d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <div className="inbox-checkbox d-flex align-items-center">
          <input
            type="checkbox"
            className="form-check-input"
            id="select-all"
            aria-label="Select all messages"
            style={{ width: '1.25em', height: '1.25em' }}
            checked={selectedMessages.size === messages.length && messages.length > 0}
            ref={el => {
              if (el) {
                el.indeterminate = selectedMessages.size > 0 && selectedMessages.size < messages.length;
              }
            }}
            onChange={e => e.target.checked ? onSelectAll() : onDeselectAll()}
          />
        </div>

        <div className="inbox-controls d-flex align-items-center">
          {!hasSelectedMessages ? (
            <>
              <button
                className="btn btn-circle btn-light"
                aria-label="Refresh"
                onClick={onRefresh}
                title="Refresh"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
              <button
                className="btn btn-circle btn-light"
                aria-label="Mark all as read"
                onClick={onMarkAllRead}
                title="Mark all as read"
              >
                <i className="bi bi-envelope-open"></i>
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-circle btn-light"
                aria-label="Delete selected"
                onClick={onDeleteSelected}
                title="Delete selected messages"
              >
                <i className="bi bi-trash"></i>
              </button>

              <LabelDropdown
                labels={selectableLabels}
                allLabels={labels}
                showDropdown={showLabelDropdown}
                onToggleDropdown={() => setShowLabelDropdown(!showLabelDropdown)}
                onAddToLabel={onAddToLabel}
              />

              <button
                className="btn btn-circle btn-light"
                aria-label="Mark as spam"
                onClick={onMarkAsSpam}
                title="Mark as spam and add URLs to blacklist"
              >
                <i className="bi bi-shield-x"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default InboxHeader;