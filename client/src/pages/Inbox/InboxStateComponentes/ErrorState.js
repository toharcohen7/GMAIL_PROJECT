import React from 'react';

function ErrorState({ error, onRetry }) {
  return (
    <div className="error-state text-center p-5">
      <div className="error-icon mb-3 text-danger">
        <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '3rem' }}></i>
      </div>
      <p className="error-message text-danger">{error}</p>
      <button className="retry-btn btn btn-primary mt-3" onClick={onRetry}>Retry</button>
    </div>
  );
}

export default ErrorState;