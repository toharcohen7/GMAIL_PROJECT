import React from 'react';
import MessageItem from './MessageItem';

function MessageList({ 
  messages, 
  selectedMessages, 
  senderCache, 
  onToggleSelect, 
  onMailClick 
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
        />
      ))}
    </div>
  );
}

export default MessageList;