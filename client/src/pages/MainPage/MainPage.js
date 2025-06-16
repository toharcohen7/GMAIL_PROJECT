import Inbox from '../../components/Inbox/MainInbox';
import SideBar from '../../components/SideBar/SideBar';
import TopBar from "../../components/TopBar/TopBar";

function MainPage() {
  return (
    <div className="bg-MainPage main-page-container">
      <TopBar />
      <div className="content-container">
        <SideBar />
        <Inbox />
      </div>
    </div>
  );
}


export default MainPage;

