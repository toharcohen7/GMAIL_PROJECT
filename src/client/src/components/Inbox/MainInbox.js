import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './MainInbox.css';

import { getUserDetails } from './InboxUtilityFunc/UserDataExt';
import InboxHeader from './InboxHeader/InboxHeader';
import MessageList from './MessageComponents/MessageList';
import MailDetail from './MailDetail';
import DraftEditor from './DraftEditor/DraftEditor';
import LoadingState from './InboxStateComponentes/LoadingState';
import ErrorState from './InboxStateComponentes/ErrorState';
import EmptyState from './InboxStateComponentes/EmptyState';
import { FetchWithAuth } from '../FetchWithAuth/FetchWithAuth';
import LabelManager from './LabelButton/LabelManager';
import { buildApiUrl } from '../../config/api';

function Inbox({ selectedLabel, searchQuery, onRefresh }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMail, setSelectedMail] = useState(null);
  const [senderCache, setSenderCache] = useState(new Map());
  const [draftToEdit, setDraftToEdit] = useState(null);

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
      const res = await FetchWithAuth(buildApiUrl('/api/mails'));
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


  useEffect(() => {
    const searchFromServer = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      setError(null);

      try {
        let data = [];

        if (searchQuery) {
          const res = await FetchWithAuth(buildApiUrl(`/api/mails/search/${encodeURIComponent(searchQuery)}`));
          if (!res.ok) throw new Error('Search failed');
          data = await res.json();
        } else {
          const res = await FetchWithAuth(buildApiUrl('api/mails'));
          if (!res.ok) throw new Error('Failed to load messages');
          data = await res.json();
        }

        setMessages(data);
        setSelectedMessages(new Set());
        loadSenderNames(data);

      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      }

      setIsLoading(false);
    };

    searchFromServer();
  }, [searchQuery, currentUser, loadSenderNames]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      setError(null);

      try {
        let data = [];

        const res = await FetchWithAuth(
          searchQuery
            ? buildApiUrl(`/api/mails/search/${encodeURIComponent(searchQuery)}`)
            : buildApiUrl('/api/mails')
        );

        if (!res.ok) throw new Error(searchQuery ? 'Search failed' : 'Failed to load messages');

        data = await res.json();
        setMessages(data);
        setSelectedMessages(new Set());
        loadSenderNames(data);

      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      }

      setIsLoading(false);
    };

    fetchMessages();
  }, [searchQuery, selectedLabel, onRefresh, currentUser, loadSenderNames]);

  const selectAllMessages = () => setSelectedMessages(new Set(filteredMessages.map(msg => msg.id)));
  const deselectAllMessages = () => setSelectedMessages(new Set());
  const toggleSelectMessage = (id) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleRefresh = async () => {
    await loadMessages();
    if (onRefresh) onRefresh();
  };

  const handleRetry = () => loadMessages();


  const handleMarkAsRead = async () => {
    try {
      const updatedMessages = await Promise.all(
        messages.map(async (mail) => {
          if (selectedMessages.has(mail.id) && !mail.onRead) {
            const res = await FetchWithAuth(buildApiUrl(`/api/mails/${mail.id}`), {
              method: 'PATCH',
              body: JSON.stringify({ onRead: true })
            });

            if (res && res.ok) {
              return { ...mail, onRead: true };
            }
          }

          return mail;
        })
      );

      setMessages(updatedMessages);
      setSelectedMessages(new Set());
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to mark selected mails as read:', err);
      setError('Failed to mark selected mails as read');
    }
  };

  const handleMarkAsUnread = async () => {
    try {
      const updatedMessages = await Promise.all(
        messages.map(async (mail) => {
          if (selectedMessages.has(mail.id) && mail.onRead) {
            const res = await FetchWithAuth(buildApiUrl(`/api/mails/${mail.id}`), {
              method: 'PATCH',
              body: JSON.stringify({ onRead: false })
            });

            if (res && res.ok) {
              return { ...mail, onRead: false };
            }
          }

          return mail;
        })
      );

      setMessages(updatedMessages);
      setSelectedMessages(new Set());
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to mark selected mails as unread:', err);
      setError('Failed to mark selected mails as unread');
    }
  };




  const handleDeleteSelected = async () => {
    if (!currentUser) return;
    try {
      const deletePromises = Array.from(selectedMessages).map(id =>
        FetchWithAuth(buildApiUrl(`/api/mails/${id}`), { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
      await loadMessages();
      if (onRefresh) onRefresh();
    } catch (e) {
      setError('Failed to delete messages');
    }
  };

  const handleDeleteSingleMessage = async (id) => {
    if (!currentUser) return;
    try {
      await FetchWithAuth(buildApiUrl(`/api/mails/${id}`), { method: 'DELETE' });
      await loadMessages();
      if (onRefresh) onRefresh();

      setSelectedMail(null);
    } catch (e) {
      setError('Failed to delete message');
    }
  };

  const handleMarkAsSpam = async () => {
    if (!currentUser) return;
    try {
      // Get the full message objects for selected messages
      const selectedData = messages.filter(msg => selectedMessages.has(msg.id));
      console.log("Selected messages for spam:", selectedData);

      // Improved regex that matches URLs with or without http/https prefix
      const urlRegex = /(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/gi;
      const urls = new Set();

      // Extract URLs from both subject and content fields
      selectedData.forEach(msg => {
        const subjectMatches = msg.subject ? String(msg.subject).match(urlRegex) || [] : [];
        const contentMatches = msg.content ? String(msg.content).match(urlRegex) || [] : [];

        subjectMatches.forEach(url => urls.add(url));
        contentMatches.forEach(url => urls.add(url));
      });

      console.log("URLs found to blacklist:", Array.from(urls));

      // Add URLs to blacklist
      if (urls.size > 0) {
        for (const url of urls) {
          try {
            const response = await FetchWithAuth(buildApiUrl('api/blacklist'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url })
            });
            console.log(`URL ${url} blacklist result:`, response);
          } catch (error) {
            console.error(`Error blacklisting URL ${url}:`, error);
          }
        }
      }

      // Mark messages as spam
      for (const id of selectedMessages) {
        try {
          await FetchWithAuth(buildApiUrl(`api/mails/${id}`), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ labelName: 'Spam' })
          });
        } catch (error) {
          console.error(`Error marking message ${id} as spam:`, error);
        }
      }

      await loadMessages();
      if (onRefresh) onRefresh();
      setSelectedMessages(new Set());

    } catch (e) {
      setError('Failed to mark messages as spam');
      console.error('Error in handleMarkAsSpam:', e);
    }
  };

  const handleMailClick = async (msg, e) => {
    if (e.target.classList.contains('form-check-input')) return;

    if (!msg.onRead) {
      setMessages(msgs =>
        msgs.map(m => m.id === msg.id ? { ...m, onRead: true } : m)
      );

      try {
        await FetchWithAuth(buildApiUrl(`/api/mails/${msg.id}`), {
          method: 'PATCH',
          body: JSON.stringify({ onRead: true })
        });
      } catch (err) {
        console.error('Failed to mark mail as read on server:', err);
      }
    }

    setSelectedMail(msg);
  };


  // Add handler for completing drafts
  const handleCompleteDraft = async (draft) => {
    try {
      const res = await FetchWithAuth(buildApiUrl(`/api/mails/${draft.id}`));
      if (!res.ok) throw new Error('Failed to fetch updated draft');
      const freshDraft = await res.json();
      setDraftToEdit(freshDraft);
    } catch (err) {
      console.error('Error loading draft:', err);
      setError('Failed to load draft');
    }
  };


  // Handler for when draft is successfully sent
  const handleDraftSent = () => {
    // Refresh mail list to reflect changes
    loadMessages();
    if (onRefresh) onRefresh();
  };

  const filteredMessages = messages.filter(m =>
    (!selectedLabel || m.labelName === selectedLabel)
  );

  // Use the simplified LabelManager component
  const { handleMoveToLabel } = LabelManager({
    currentUser,
    selectedMessages,
    setSelectedMessages,
    loadMessages,
    setError,
    onRefresh
  });

  return currentUser ? (
    <div className="inbox-wrapper">
      <div className="inbox-container card shadow-sm">
        <InboxHeader
          messages={filteredMessages}
          selectedMessages={selectedMessages}
          hasSelectedMessages={selectedMessages.size > 0}
          onSelectAll={selectAllMessages}
          onDeselectAll={deselectAllMessages}
          onRefresh={handleRefresh}
          onMarkAsRead={handleMarkAsRead}
          onMarkAsUnread={handleMarkAsUnread}
          onDeleteSelected={handleDeleteSelected}
          onMarkAsSpam={handleMarkAsSpam}
          onMoveToLabel={handleMoveToLabel}
          currentLabel={selectedLabel}
        />

        <div className="inbox-content card-body p-0">
          {isLoading && <LoadingState />}
          {error && <ErrorState error={error} onRetry={handleRetry} />}
          {!isLoading && !error && filteredMessages.length === 0 && <EmptyState />}
          {!isLoading && !error && filteredMessages.length > 0 && (
            <MessageList
              messages={filteredMessages}
              selectedMessages={selectedMessages}
              senderCache={senderCache}
              onToggleSelect={toggleSelectMessage}
              onMailClick={handleMailClick}
              onCompleteDraft={handleCompleteDraft}
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

        {/* Draft editor overlay */}
        {draftToEdit && (
          <DraftEditor
            draft={draftToEdit}
            onClose={() => setDraftToEdit(null)}
            onSuccess={handleDraftSent}
          />
        )}
      </div>
    </div>
  ) : null;
}

export default Inbox;