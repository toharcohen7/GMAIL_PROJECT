import React from 'react';
import MessageItem from './MessageItem';

function MessageList({ 
  messages, 
  selectedMessages, 
  senderCache, 
  onToggleSelect, 
  onMailClick,
  onCompleteDraft 
}) {
  return (
    <div className="message-list list-group" role="list" tabIndex="0">
      {messages.map((message, idx) => (
        <MessageItem
          key={message.id}
          message={message}
          index={idx}
          isSelected={selectedMessages.has(message.id)}
          senderName={senderCache.get(message.senderId) || 'Loading...'}
          onToggleSelect={onToggleSelect}
          onMailClick={onMailClick}
          onCompleteDraft={onCompleteDraft}
        />
      ))}
    </div>
  );
}

export default MessageList;