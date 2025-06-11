import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import SignIn from "./pages/SignIn";

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
      </Routes>
    </Router>
  );
}

export default App;
