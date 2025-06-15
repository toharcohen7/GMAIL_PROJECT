import React from 'react';

function LoadingState() {
  return (
    <div className="loading-state text-center p-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">Loading messages...</p>
    </div>
  );
}

export default LoadingState;