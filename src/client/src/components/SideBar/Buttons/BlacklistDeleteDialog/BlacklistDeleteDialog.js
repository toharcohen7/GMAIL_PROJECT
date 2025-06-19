import React, { useState, useEffect } from 'react';
import { FetchWithAuth } from '../../../FetchWithAuth/FetchWithAuth';
import './BlacklistDeleteDialog.css';
import { buildApiUrl } from '../../../../config/api';

function BlacklistDeleteDialog({ onClose }) {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState(null); // 'success', 'error', or null
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(null);

    // Add effect for auto-closing after successful deletion
    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            
            setCountdown(3);
            
            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    const newValue = prev - 1;
                    if (newValue <= 0) {
                        clearInterval(countdownInterval);
                    }
                    return newValue;
                });
            }, 1000);
            
            return () => {
                clearTimeout(timer);
                clearInterval(countdownInterval);
            };
        }
    }, [status, onClose]);

    const handleDeleteUrl = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        
        try {
            setLoading(true);
            const response = await FetchWithAuth(buildApiUrl(`/api/blacklist/${encodeURIComponent(url.trim())}`), {
                method: 'DELETE'
            });

            if (response.status === 204) {
                setStatus('success');
                setMessage(`Successfully removed "${url}" from blacklist.`);
                setUrl('');
            } else {
                const errorData = await response.json();
                setStatus('error');
                setMessage(errorData.error || `Failed to delete "${url}" from blacklist.`);
            }
        } catch (err) {
            console.error('Error deleting URL:', err);
            setStatus('error');
            setMessage(`Network error while deleting "${url}".`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blacklist-dialog-backdrop" onClick={onClose}>
            <div className="blacklist-dialog-modal" onClick={e => e.stopPropagation()}>
                <div className="blacklist-dialog-header">
                    <h5>Delete URL from Blacklist</h5>
                    <button className="btn-close" onClick={onClose}>
                        <i className="bi bi-x"></i>
                    </button>
                </div>
                
                <div className="blacklist-dialog-body">
                    <form onSubmit={handleDeleteUrl}>
                        <div className="mb-3">
                            <label htmlFor="urlInput" className="form-label">Enter URL to remove from blacklist:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="urlInput"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="e.g., www.example.com"
                                disabled={loading || status === 'success'}
                                required
                            />
                        </div>
                        
                        {status === 'success' && (
                            <div className="alert alert-success" role="alert">
                                {message} Window will close in {countdown} seconds...
                            </div>
                        )}
                        
                        {status === 'error' && (
                            <div className="alert alert-danger" role="alert">
                                {message}
                            </div>
                        )}
                        
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-danger" 
                                disabled={loading || !url.trim() || status === 'success'}
                            >
                                {loading ? 'Deleting...' : 'Delete from Blacklist'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BlacklistDeleteDialog;