import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from './pages/SignUp/SignUp';

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
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
