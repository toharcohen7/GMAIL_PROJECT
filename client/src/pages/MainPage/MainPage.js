import Inbox from '../../components/Inbox/MainInbox';
import TopBar from "../../components/TopBar/TopBar";


function MainPage(){
    return(
        <div className="bg-MainPage">
        <TopBar />
        <Inbox />
        </div>
    );
}

export default MainPage;

