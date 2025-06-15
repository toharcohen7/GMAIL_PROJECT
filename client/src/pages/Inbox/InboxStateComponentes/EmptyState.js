import React from 'react';

function EmptyState() {
  return (
    <div className="empty-state text-center p-5">
      <div className="empty-icon mb-3 text-muted">
        <i className="bi bi-inbox-fill" style={{ fontSize: '3rem' }}></i>
      </div>
      <p className="lead text-muted">Your inbox is empty</p>
    </div>
  );
}

export default EmptyState;