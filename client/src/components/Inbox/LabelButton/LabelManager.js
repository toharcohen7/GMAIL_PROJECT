// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import { FetchWithAuth } from '../../FetchWithAuth/FetchWithAuth';

const LabelManager = ({ 
  currentUser, 
  selectedMessages, 
  setSelectedMessages, 
  loadMessages, 
  setError 
}) => {
  const handleMoveToLabel = async (labelName) => {
    if (!currentUser || selectedMessages.size === 0) return;
    
    try {
      const movePromises = Array.from(selectedMessages).map(id =>
        FetchWithAuth(`http://localhost:12345/api/mails/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ labelName })
        })
      );
      
      await Promise.all(movePromises);
      await loadMessages();
      setSelectedMessages(new Set()); // Clear selection
    } catch (error) {
      setError(`Failed to move messages to ${labelName}`);
      console.error('Error moving messages to label:', error);
    }
  };

  return {
    handleMoveToLabel
  };
};

export default LabelManager;