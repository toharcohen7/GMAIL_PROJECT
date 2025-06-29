import React, { useEffect, useState } from 'react';
import { getUserDetails } from '../InboxUtilityFunc/UserDataExt';
import './MailDetail.css';


function MailDetail({ message, onClose, onDelete }) {
  const [senderName, setSenderName] = useState('Loading...');

  useEffect(() => {
    const fetchSenderName = async () => {
      if (message.senderId) {
        const userDetails = await getUserDetails(message.senderId);
        if (userDetails && userDetails.firstName && userDetails.lastName && userDetails.userName) {
          setSenderName(`${userDetails.firstName} ${userDetails.lastName} <${userDetails.userName}>`);
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
    <div className="mail-detail-overlay">
      <div className="mail-detail-container">
        <div className="mail-detail-header">
          <h5 className="mb-0">{message.subject || 'No Subject'}</h5>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(message._id)}>
              <i className="bi bi-trash me-1"></i>Delete
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div className="mail-detail-info">
          <div className="row">
            <div className="col-md-12">
              <strong>From:</strong> {senderName}
            </div>
            <div className="col-md-12 text-muted small mt-0">
              {message.time ? new Date(message.time).toLocaleString() : ''}
            </div>
          </div>
        </div>

        <div className="mail-detail-content">
          <div>
            {message.content || 'No content available.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MailDetail;