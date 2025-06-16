import React from 'react';
import TopBar from '../../components/TopBar/TopBar';
import SideBar from '../../components/SideBar/SideBar';
import MainInbox from '../../components/Inbox/MainInbox';
import './MainPage.css';

function MainPage() {
  return (
    <div className="main-page-container">
      <TopBar />
      <div className="content-container">
        <SideBar />
        <MainInbox />
      </div>
    </div>
  );
}

export default MainPage;

