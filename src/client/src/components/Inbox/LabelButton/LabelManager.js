// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import { FetchWithAuth } from '../../FetchWithAuth/FetchWithAuth';
import { buildApiUrl } from '../../../config/api';

const LabelManager = ({ 
  currentUser, 
  selectedMessages, 
  setSelectedMessages, 
  loadMessages, 
  setError,
  onRefresh
}) => {
  const handleMoveToLabel = async (labelName) => {
    if (!currentUser || selectedMessages.size === 0) return;
    
    try {
      const movePromises = Array.from(selectedMessages).map(_id =>
        FetchWithAuth(buildApiUrl(`api/mails/${_id}`), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ labelName })
        })
      );
      
      await Promise.all(movePromises);
      await loadMessages();
      if (onRefresh) onRefresh();
      setSelectedMessages(new Set());
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