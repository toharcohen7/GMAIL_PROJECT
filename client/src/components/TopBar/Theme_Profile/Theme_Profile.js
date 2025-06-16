
import LogOut from "../LogOut/LogOut";
import DarkMode from "../DarkMode/DarkMode";
import Profile from "../Profile/Profile";

function Theme_Profile(){

    

    return(
        <div className="position-relative d-flex align-items-center gap-2">
            <LogOut />
            <DarkMode />
            <Profile />
        </div>
    );
}

export default Theme_Profile;