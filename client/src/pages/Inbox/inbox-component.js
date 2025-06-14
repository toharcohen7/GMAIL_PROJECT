import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './inbox-component.css';

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '';
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

// Function to get user details by ID
const getUserDetails = async (userId) => {
  try {
    const res = await fetch(`http://localhost:12345/api/users/${userId}`);
    if (!res.ok) throw new Error('User not found');
    const userData = await res.json();
    return userData;
  } catch (e) {
    console.error('Failed to get user details:', e);
    return null;
  }
};

// Mail Detail View Component
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

function Inbox() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [labels, setLabels] = useState([]);
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [senderCache, setSenderCache] = useState(new Map()); // Cache for sender names
  const navigate = useNavigate();

  // Check for existing authentication on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
      } catch (err) {
        console.error('Invalid stored user data');
        localStorage.removeItem('currentUser');
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  }, [navigate]);

// Load messages only when user is authenticated
useEffect(() => {
  if (currentUser) {
    loadMessages();
    loadLabels();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentUser]);

  const loadMessages = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:12345/api/mails', {
        headers: {
          'user-id': currentUser.id.toString()
        }
      });
      if (!res.ok) throw new Error('Failed to load messages');
      const data = await res.json();
      console.log('Messages loaded:', data); // Debug log
      setMessages(data);
      setSelectedMessages(new Set());
      
      // Load sender names for all messages
      loadSenderNames(data);
    } catch (e) {
      setError('Failed to load messages. Please try again.');
      console.error('Load messages error:', e);
    }
    setIsLoading(false);
  };

  // Load sender names for all messages
  const loadSenderNames = async (messages) => {
    const senderIds = [...new Set(messages.map(msg => msg.senderId).filter(id => id))];
    const newSenderCache = new Map(senderCache);

    for (const senderId of senderIds) {
      if (!newSenderCache.has(senderId)) {
        try {
          const userDetails = await getUserDetails(senderId);
          if (userDetails && userDetails.firstName && userDetails.lastName) {
            newSenderCache.set(senderId, `${userDetails.firstName} ${userDetails.lastName}`);
          } else if (userDetails && userDetails.email) {
            newSenderCache.set(senderId, userDetails.email);
          } else {
            newSenderCache.set(senderId, 'Unknown Sender');
          }
        } catch (e) {
          newSenderCache.set(senderId, 'Unknown Sender');
        }
      }
    }

    setSenderCache(newSenderCache);
  };

  const loadLabels = async () => {
  if (!currentUser) return;
  
  try {
    console.log('Loading labels for user:', currentUser.id); // Debug log
    const res = await fetch('http://localhost:12345/api/labels', {
      headers: {
        'user-id': currentUser.id.toString()
      }
    });
    if (!res.ok) {
      console.error('Labels API response not OK:', res.status, res.statusText);
      throw new Error('Failed to load labels');
    }
    const data = await res.json();
    console.log('Raw labels data:', data); // Debug the actual response
    console.log('Labels array check:', Array.isArray(data)); // Check if it's an array
    
    // More flexible data handling
    let labelsArray = [];
    if (Array.isArray(data)) {
      labelsArray = data;
    } else if (data && Array.isArray(data.labels)) {
      labelsArray = data.labels;
    } else if (data && typeof data === 'object') {
      // If it's an object, try to extract label names
      labelsArray = Object.values(data);
    }
    
    console.log('Processed labels:', labelsArray); // Debug processed labels
    setLabels(labelsArray);
  } catch (e) {
    console.error('Failed to load labels:', e);
    setLabels([]);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setMessages([]);
    setSelectedMessages(new Set());
    setLabels([]);
    setSenderCache(new Map());
    setError(null);
    navigate('/signin');
  };

  const selectAllMessages = () => {
    setSelectedMessages(new Set(messages.map(msg => msg.id)));
  };
  const deselectAllMessages = () => {
    setSelectedMessages(new Set());
  };
  const toggleSelectMessage = (id) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleRefresh = () => loadMessages();
  const handleRetry = () => loadMessages();

  // Delete selected messages
  const handleDeleteSelected = async () => {
    if (!currentUser) return;
    
    try {
      const deletePromises = Array.from(selectedMessages).map(messageId =>
        fetch(`http://localhost:12345/api/mails/${messageId}`, {
          method: 'DELETE',
          headers: {
            'user-id': currentUser.id.toString()
          }
        })
      );
      
      await Promise.all(deletePromises);
      await loadMessages();
    } catch (e) {
      setError('Failed to delete messages');
    }
  };

  // Delete single message
  const handleDeleteSingleMessage = async (messageId) => {
    if (!currentUser) return;
    
    try {
      await fetch(`http://localhost:12345/api/mails/${messageId}`, {
        method: 'DELETE',
        headers: {
          'user-id': currentUser.id.toString()
        }
      });
      
      await loadMessages();
      setSelectedMail(null);
    } catch (e) {
      setError('Failed to delete message');
    }
  };

  // Add selected messages to a label
  const handleAddToLabel = async (labelName, labelIndex) => {
    if (!currentUser) return;
    
    try {
      console.log(`Adding messages to label: ${labelName} (index: ${labelIndex})`);
      
      const updatePromises = Array.from(selectedMessages).map(messageId =>
        fetch(`http://localhost:12345/api/mails/${messageId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'user-id': currentUser.id.toString()
          },
          body: JSON.stringify({ labelId: labelIndex })
        })
      );
      
      await Promise.all(updatePromises);
      await loadMessages();
      setShowLabelDropdown(false);
      
    } catch (e) {
      setError('Failed to add messages to label');
      console.error('Add to label error:', e);
    }
  };

  // Add URLs from selected messages to spam blacklist
  const handleMarkAsSpam = async () => {
    if (!currentUser) return;
    
    try {
      const selectedMessageData = messages.filter(msg => selectedMessages.has(msg.id));
      
      const urlRegex = /https?:\/\/[^\s]+/gi;
      const urls = new Set();
      
      selectedMessageData.forEach(msg => {
        const subjectUrls = (msg.subject || '').match(urlRegex) || [];
        const contentUrls = (msg.content || '').match(urlRegex) || [];
        [...subjectUrls, ...contentUrls].forEach(url => urls.add(url));
      });

      const blacklistPromises = Array.from(urls).map(url =>
        fetch('http://localhost:12345/api/blacklist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url })
        })
      );
      
      await Promise.all(blacklistPromises);
      await handleDeleteSelected();
      
    } catch (e) {
      setError('Failed to mark messages as spam');
    }
  };

  // Handle mail click
  const handleMailClick = (message, e) => {
    if (e.target.classList.contains('form-check-input')) return;
    
    if (!message.read) {
      setMessages(msgs => msgs.map(m => m.id === message.id ? { ...m, read: true } : m));
    }
    
    setSelectedMail(message);
  };

// Filter labels to exclude "sent" and "draft"
const getSelectableLabels = () => {
  const filtered = labels.filter(label => {
    const lowerLabel = label.toLowerCase();
    return lowerLabel !== 'sent' && lowerLabel !== 'draft';
  });
  return filtered;
};

  const hasSelectedMessages = selectedMessages.size > 0;
  const selectableLabels = getSelectableLabels();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="inbox-container card shadow-sm mt-4">
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
              onChange={e => e.target.checked ? selectAllMessages() : deselectAllMessages()}
            />
          </div>
          
          <div className="inbox-controls d-flex align-items-center">
            {!hasSelectedMessages ? (
              <>
                <button
                  className="btn btn-circle btn-light"
                  aria-label="Refresh"
                  onClick={handleRefresh}
                  title="Refresh"
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
                <button
                  className="btn btn-circle btn-light"
                  aria-label="Mark all as read"
                  onClick={() => {
                    setMessages(msgs => msgs.map(m => ({ ...m, read: true })));
                  }}
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
                  onClick={handleDeleteSelected}
                  title="Delete selected messages"
                >
                  <i className="bi bi-trash"></i>
                </button>
                
                <div className="position-relative">
                  <button
                    className="btn btn-circle btn-light"
                    aria-label="Add to label"
                    onClick={() => setShowLabelDropdown(!showLabelDropdown)}
                    title="Add to label"
                    disabled={selectableLabels.length === 0}
                  >
                    <i className="bi bi-tag"></i>
                  </button>
                  
                  {showLabelDropdown && (
                    <div 
                      className="position-absolute bg-white border rounded shadow-sm"
                      style={{ 
                        top: '100%', 
                        left: '0', 
                        minWidth: '200px', 
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}
                    >
                      {selectableLabels.length > 0 ? (
                        selectableLabels.map((label, originalIndex) => {
                          const realIndex = labels.indexOf(label);
                          return (
                            <button
                              key={originalIndex}
                              className="dropdown-item btn btn-link text-start w-100 border-0 px-3 py-2"
                              style={{ backgroundColor: 'transparent' }}
                              onClick={() => handleAddToLabel(label, realIndex)}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              {label}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-3 py-2 text-muted">No moveable labels available</div>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  className="btn btn-circle btn-light"
                  aria-label="Mark as spam"
                  onClick={handleMarkAsSpam}
                  title="Mark as spam and add URLs to blacklist"
                >
                  <i className="bi bi-shield-x"></i>
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleLogout}
            title="Sign out"
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Sign Out
          </button>
        </div>
      </div>

      {showLabelDropdown && (
        <div 
          className="position-fixed w-100 h-100"
          style={{ top: 0, left: 0, zIndex: 999 }}
          onClick={() => setShowLabelDropdown(false)}
        />
      )}

      <div className="inbox-content card-body p-0">
        {isLoading && (
          <div className="loading-state text-center p-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading messages...</p>
          </div>
        )}
        {error && (
          <div className="error-state text-center p-5">
            <div className="error-icon mb-3 text-danger">
              <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '3rem' }}></i>
            </div>
            <p className="error-message text-danger">{error}</p>
            <button className="retry-btn btn btn-primary mt-3" onClick={handleRetry}>Retry</button>
          </div>
        )}
        {!isLoading && !error && messages.length === 0 && (
          <div className="empty-state text-center p-5">
            <div className="empty-icon mb-3 text-muted">
              <i className="bi bi-inbox-fill" style={{ fontSize: '3rem' }}></i>
            </div>
            <p className="lead text-muted">Your inbox is empty</p>
          </div>
        )}
        {!isLoading && !error && messages.length > 0 && (
          <div className="message-list list-group" role="list" tabIndex="0">
            {messages.map((message, idx) => {
              const isRead = message.read;
              const isSelected = selectedMessages.has(message.id);
              
              // Get sender name from cache
              const senderName = senderCache.get(message.senderId) || 'Loading...';
              
              return (
                <div
                  key={message.id}
                  className={`message-item list-group-item list-group-item-action d-flex align-items-center ${isRead ? 'read' : 'fw-bold unread'} ${isSelected ? 'active' : ''}`}
                  role="listitem"
                  tabIndex={0}
                  data-message-id={message.id}
                  data-index={idx}
                  onClick={(e) => handleMailClick(message, e)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="message-select">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`msg-${message.id}`}
                      aria-label="Select this message"
                      checked={isSelected}
                      onChange={() => toggleSelectMessage(message.id)}
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
            })}
          </div>
        )}
      </div>

      {selectedMail && (
        <MailDetail
          message={selectedMail}
          onClose={() => setSelectedMail(null)}
          onDelete={handleDeleteSingleMessage}
        />
      )}
    </div>
  );
}

export default Inbox;