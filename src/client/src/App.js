import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from './pages/SignUp/SignUp';
import './components/Styles/Theme.css';
import MainPage from './pages/MainPage/MainPage';


function WelcomeWrapper() {
  const navigate = useNavigate();

  const handleCreateUser = () => {
    navigate("/signup");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  return (
    <WelcomePage
      onCreateUser={handleCreateUser}
      onSignIn={handleSignIn}
    />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeWrapper />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mainpage" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
