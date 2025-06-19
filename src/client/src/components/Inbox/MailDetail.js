import React, { useEffect, useState } from 'react';
import { getUserDetails } from './InboxUtilityFunc/UserDataExt';


function MailDetail({ message, onClose, onDelete }) {
  const [senderName, setSenderName] = useState('Loading...');

  useEffect(() => {
    const fetchSenderName = async () => {
      if (message.senderId) {
        const userDetails = await getUserDetails(message.senderId);
        if (userDetails && userDetails.firstName && userDetails.lastName) {
          setSenderName(`${userDetails.firstName} ${userDetails.lastName}`);
        } else if (userDetails && userDetails.email) {
          setSenderName(userDetails.email);
        } else {
          setSenderName('Unknown Sender');
        }
      } else {
        setSenderName('Unknown Sender');
      }
    };

    fetchSenderName();
  }, [message.senderId]);

  return (
    <div className="mail-detail-overlay position-fixed w-100 h-100" style={{ top: 0, left: 0, zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="mail-detail-container position-absolute bg-white rounded shadow-lg" 
           style={{ top: '5%', left: '10%', width: '80%', height: '90%', overflow: 'hidden' }}>
        
        <div className="mail-detail-header p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{message.subject || 'No Subject'}</h5>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(message.id)}>
              <i className="bi bi-trash me-1"></i>Delete
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div className="mail-detail-info p-3 border-bottom bg-light">
          <div className="row">
            <div className="col-md-6">
              <strong>From:</strong> {senderName}
            </div>
            <div className="col-md-6 text-end">
              <small className="text-muted">
                {message.time ? new Date(message.time).toLocaleString() : ''}
              </small>
            </div>
          </div>
          {message.receivers && Array.isArray(message.receivers) && (
            <div className="mt-2">
              <strong>To:</strong> {message.receivers.join(', ')}
            </div>
          )}
          {message.receiversName && Array.isArray(message.receiversName) && (
            <div className="mt-2">
              <strong>To:</strong> {message.receiversName.join(', ')}
            </div>
          )}
        </div>

        <div className="mail-detail-content p-3" style={{ height: 'calc(100% - 160px)', overflowY: 'auto' }}>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {message.content || 'No content available.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MailDetail;