import React, { useState } from 'react';
import { FetchWithAuth } from '../../FetchWithAuth/FetchWithAuth';
import './DraftEditor.css';

function DraftEditor({ draft, onClose, onSuccess }) {
  const [to, setTo] = useState(draft.receiversNames ? draft.receiversNames.join(', ') : '');
  const [subject, setSubject] = useState(draft.subject || '');
  const [content, setContent] = useState(draft.content || '');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    
    try {
      const receivers = to.split(',').map(name => name.trim()).filter(Boolean);
      
      if (receivers.length === 0) {
        setError('Please enter at least one recipient');
        setIsSending(false);
        return;
      }
      
      const response = await FetchWithAuth(`http://localhost:12345/api/mails/${draft.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiversNames: receivers,
          subject,
          content,
          labelName: 'Sent'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      // Success - close the editor and notify parent
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred while sending');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="draft-editor-overlay">
      <div className="draft-editor-card">
        <div className="draft-editor-header">
          <h5>Complete Draft</h5>
          <button className="close-button" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSend}>
          <div className="form-group">
            <label>To:</label>
            <input 
              type="text" 
              className="form-control" 
              value={to} 
              onChange={(e) => setTo(e.target.value)}
              placeholder="Recipient(s) separated by commas"
            />
          </div>
          
          <div className="form-group">
            <label>Subject:</label>
            <input 
              type="text" 
              className="form-control" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
          </div>
          
          <div className="form-group">
            <label>Message:</label>
            <textarea 
              className="form-control" 
              rows="6" 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="send-button" 
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DraftEditor;