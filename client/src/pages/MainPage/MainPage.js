import React, { useState } from 'react';
import TopBar from '../../components/TopBar/TopBar';
import SideBar from '../../components/SideBar/SideBar';
import MainInbox from '../../components/Inbox/MainInbox';
import './MainPage.css';

function MainPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState('Received');

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="main-page-container">
      <TopBar toggleSidebar={toggleSidebar} />
      <div className="content-container">
        <div className={`sidebar-wrapper ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
         <SideBar onLabelSelect={setSelectedLabel} />
        </div>
        <div className="inbox-responsive-wrapper">
          <MainInbox selectedLabel={selectedLabel} />
        </div>
      </div>
    </div>
  );
}

export default MainPage;

