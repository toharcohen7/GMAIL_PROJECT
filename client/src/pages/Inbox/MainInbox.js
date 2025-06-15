import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './MainInbox.css';

import { getUserDetails } from './InboxUtilityFunc/UserDataExt';
import InboxHeader from './InboxHeader/InboxHeader';
import MessageList from './MessageComponents/MessageList';
import MailDetail from './MailDetail';
import LoadingState from './InboxStateComponentes/LoadingState';
import ErrorState from './InboxStateComponentes/ErrorState';
import EmptyState from './InboxStateComponentes/EmptyState';

function Inbox() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [labels, setLabels] = useState([]);
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [senderCache, setSenderCache] = useState(new Map());
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

  // Load sender names for all messages
  const loadSenderNames = useCallback(async (messages) => {
    const senderIds = [...new Set(messages.map(msg => msg.senderId).filter(id => id))];
    
    // Use functional update to avoid depending on senderCache
    setSenderCache(prevCache => {
      const newSenderCache = new Map(prevCache);
      
      // Create promises for all missing sender IDs
      const fetchPromises = senderIds
        .filter(senderId => !newSenderCache.has(senderId))
        .map(async (senderId) => {
          try {
            const userDetails = await getUserDetails(senderId);
            if (userDetails && userDetails.firstName && userDetails.lastName) {
              return [senderId, `${userDetails.firstName} ${userDetails.lastName}`];
            } else if (userDetails && userDetails.email) {
              return [senderId, userDetails.email];
            } else {
              return [senderId, 'Unknown Sender'];
            }
          } catch (e) {
            return [senderId, 'Unknown Sender'];
          }
        });
      
      // Execute all promises and update cache
      Promise.all(fetchPromises).then(results => {
        setSenderCache(currentCache => {
          const updatedCache = new Map(currentCache);
          results.forEach(([senderId, name]) => {
            updatedCache.set(senderId, name);
          });
          return updatedCache;
        });
      });
      
      return newSenderCache;
    });
  }, []); // Remove senderCache dependency

  const loadMessages = useCallback(async () => {
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
      console.log('Messages loaded:', data);
      setMessages(data);
      setSelectedMessages(new Set());
      
      // Load sender names for all messages
      loadSenderNames(data);
    } catch (e) {
      setError('Failed to load messages. Please try again.');
      console.error('Load messages error:', e);
    }
    setIsLoading(false);
  }, [currentUser, loadSenderNames]); // Add loadSenderNames to dependencies

  const loadLabels = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      console.log('Loading labels for user:', currentUser.id);
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
      console.log('Raw labels data:', data);
      console.log('Labels array check:', Array.isArray(data));
      
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
      
      console.log('Processed labels:', labelsArray);
      setLabels(labelsArray);
    } catch (e) {
      console.error('Failed to load labels:', e);
      setLabels([]);
    }
  }, [currentUser]);

  // Load messages only when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadMessages();
      loadLabels();
    }
  }, [currentUser, loadMessages, loadLabels]);

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

  const handleMarkAllRead = () => {
    setMessages(msgs => msgs.map(m => ({ ...m, read: true })));
  };

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

  const hasSelectedMessages = selectedMessages.size > 0;

  if (!currentUser) {
    return null;
  }

  return (
    <div className="inbox-container card shadow-sm mt-4 dark-mode">
      <InboxHeader
        messages={messages}
        selectedMessages={selectedMessages}
        hasSelectedMessages={hasSelectedMessages}
        onSelectAll={selectAllMessages}
        onDeselectAll={deselectAllMessages}
        onRefresh={handleRefresh}
        onMarkAllRead={handleMarkAllRead}
        onDeleteSelected={handleDeleteSelected}
        onMarkAsSpam={handleMarkAsSpam}
        onLogout={handleLogout}
        labels={labels}
        showLabelDropdown={showLabelDropdown}
        setShowLabelDropdown={setShowLabelDropdown}
        onAddToLabel={handleAddToLabel}
      />

      {showLabelDropdown && (
        <div 
          className="position-fixed w-100 h-100"
          style={{ top: 0, left: 0, zIndex: 999 }}
          onClick={() => setShowLabelDropdown(false)}
        />
      )}

      <div className="inbox-content card-body p-0">
        {isLoading && <LoadingState />}
        {error && <ErrorState error={error} onRetry={handleRetry} />}
        {!isLoading && !error && messages.length === 0 && <EmptyState />}
        {!isLoading && !error && messages.length > 0 && (
          <MessageList
            messages={messages}
            selectedMessages={selectedMessages}
            senderCache={senderCache}
            onToggleSelect={toggleSelectMessage}
            onMailClick={handleMailClick}
          />
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