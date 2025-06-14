
import DarkMode from "../DarkMode/DarkMode";
import Profile from "../Profile/Profile";

function Theme_Profile(){

    

    return(
        <div className="position-relative d-flex align-items-center gap-2">
            {/* כפתור מצב כהה */}
            <DarkMode />

            {/* כפתור פרופיל */}
            <Profile />
        </div>
    );
}

export default Theme_Profile;