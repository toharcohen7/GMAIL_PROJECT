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
import { FetchWithAuth } from '../FetchWithAuth/FetchWithAuth';

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

  const loadSenderNames = useCallback(async (messages) => {
    const senderIds = [...new Set(messages.map(msg => msg.senderId).filter(id => id))];
    setSenderCache(prevCache => {
      const newSenderCache = new Map(prevCache);
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
  }, []);

  const loadMessages = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await FetchWithAuth('http://localhost:12345/api/mails');
      if (!res.ok) throw new Error('Failed to load messages');
      const data = await res.json();
      setMessages(data);
      setSelectedMessages(new Set());
      loadSenderNames(data);
    } catch (e) {
      setError('Failed to load messages. Please try again.');
    }
    setIsLoading(false);
  }, [currentUser, loadSenderNames]);

  const loadLabels = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await FetchWithAuth('http://localhost:12345/api/labels');
      if (!res.ok) throw new Error('Failed to load labels');
      const data = await res.json();
      let labelsArray = Array.isArray(data) ? data : (data.labels || Object.values(data));
      setLabels(labelsArray);
    } catch (e) {
      setLabels([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadMessages();
      loadLabels();
    }
  }, [currentUser, loadMessages, loadLabels]);

  const selectAllMessages = () => setSelectedMessages(new Set(messages.map(msg => msg.id)));
  const deselectAllMessages = () => setSelectedMessages(new Set());
  const toggleSelectMessage = (id) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleRefresh = () => loadMessages();
  const handleRetry = () => loadMessages();
  const handleMarkAllRead = () => setMessages(msgs => msgs.map(m => ({ ...m, read: true })));

  const handleDeleteSelected = async () => {
    if (!currentUser) return;
    try {
      const deletePromises = Array.from(selectedMessages).map(id =>
        FetchWithAuth(`http://localhost:12345/api/mails/${id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
      await loadMessages();
    } catch (e) {
      setError('Failed to delete messages');
    }
  };

  const handleDeleteSingleMessage = async (id) => {
    if (!currentUser) return;
    try {
      await FetchWithAuth(`http://localhost:12345/api/mails/${id}`, { method: 'DELETE' });
      await loadMessages();
      setSelectedMail(null);
    } catch (e) {
      setError('Failed to delete message');
    }
  };

  const handleAddToLabel = async (labelName, labelIndex) => {
    if (!currentUser) return;
    try {
      const updatePromises = Array.from(selectedMessages).map(id =>
        FetchWithAuth(`http://localhost:12345/api/mails/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ labelId: labelIndex })
        })
      );
      await Promise.all(updatePromises);
      await loadMessages();
      setShowLabelDropdown(false);
    } catch (e) {
      setError('Failed to add messages to label');
    }
  };

  const handleMarkAsSpam = async () => {
    if (!currentUser) return;
    try {
      const selectedData = messages.filter(msg => selectedMessages.has(msg.id));
      const urlRegex = /https?:\/\/[^\s]+/gi;
      const urls = new Set();
      selectedData.forEach(msg => {
        [...(msg.subject.match(urlRegex) || []), ...(msg.content.match(urlRegex) || [])].forEach(url => urls.add(url));
      });
      const blacklistPromises = Array.from(urls).map(url =>
        FetchWithAuth('http://localhost:12345/api/blacklist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        })
      );
      await Promise.all(blacklistPromises);
      await handleDeleteSelected();
    } catch (e) {
      setError('Failed to mark messages as spam');
    }
  };

  const handleMailClick = (msg, e) => {
    if (e.target.classList.contains('form-check-input')) return;
    if (!msg.read) setMessages(msgs => msgs.map(m => m.id === msg.id ? { ...m, read: true } : m));
    setSelectedMail(msg);
  };

  return currentUser ? (
    <div className="inbox-wrapper">
      <div className="inbox-container card shadow-sm">
        <InboxHeader
          messages={messages}
          selectedMessages={selectedMessages}
          hasSelectedMessages={selectedMessages.size > 0}
          onSelectAll={selectAllMessages}
          onDeselectAll={deselectAllMessages}
          onRefresh={handleRefresh}
          onMarkAllRead={handleMarkAllRead}
          onDeleteSelected={handleDeleteSelected}
          onMarkAsSpam={handleMarkAsSpam}
          labels={labels}
          showLabelDropdown={showLabelDropdown}
          setShowLabelDropdown={setShowLabelDropdown}
          onAddToLabel={handleAddToLabel}
        />

        {showLabelDropdown && (
          <div className="position-fixed w-100 h-100" style={{ top: 0, left: 0, zIndex: 999 }} onClick={() => setShowLabelDropdown(false)} />
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
    </div>
  ) : null;
}

export default Inbox;
