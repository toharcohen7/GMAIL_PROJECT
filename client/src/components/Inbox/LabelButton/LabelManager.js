// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import { FetchWithAuth } from '../../FetchWithAuth/FetchWithAuth';

const LabelManager = ({ 
  currentUser, 
  selectedLabel, 
  selectedMessages, 
  setSelectedMessages, 
  loadMessages, 
  setError,
  onRefresh
}) => {
  const [availableLabels, setAvailableLabels] = useState([]);
  
  const loadLabels = useCallback(async () => {
    if (!currentUser) return [];
    
    try {
      const response = await FetchWithAuth('http://localhost:12345/api/labels');
      if (response.ok) {
        const data = await response.json();
        // Filter out system labels and current label
        const filteredLabels = data.filter(label => 
          !['Draft', 'Sent'].includes(label.name) && 
          label.name !== selectedLabel
        );
        
        setAvailableLabels(filteredLabels);
        return filteredLabels;
      }
      return [];
    } catch (error) {
      console.error('Error fetching labels:', error);
      return [];
    }
  }, [currentUser, selectedLabel]);

  useEffect(() => {
    if (currentUser) {
      loadLabels();
    }
  }, [currentUser, selectedLabel, loadLabels]);

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
      if (onRefresh) onRefresh();
      setSelectedMessages(new Set()); // Clear selection
    } catch (error) {
      setError(`Failed to move messages to ${labelName}`);
      console.error('Error moving messages to label:', error);
    }
  };

  return {
    availableLabels,
    handleMoveToLabel,
    loadLabels
  };
};

export default LabelManager;