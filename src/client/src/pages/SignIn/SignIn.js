import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../images/logo.png';
import { FetchWithAuth } from '../../components/FetchWithAuth/FetchWithAuth';
import { buildApiUrl } from '../../config/api';

function SignIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    await getToken(userName, password);
  };

  async function getToken(userName, password) {
    try {
      const response = await fetch(buildApiUrl("api/tokens"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      console.log("TOKEN RESPONSE:", data); // ← כאן תראה מה באמת חזרת
      localStorage.setItem("token", data.token);

      // Fetch user data with FetchWithAuth
      const userResponse = await FetchWithAuth(buildApiUrl("api/users/me"));

      if (userResponse && userResponse.ok) {
        const userData = await userResponse.json();
        localStorage.setItem("currentUser", JSON.stringify(userData));
      }

      navigate("/mainpage");

    } catch (error) {
      console.error("Error signing in:", error);
      setError(error.message);
    }
  }

  return (
    <div className="signin-fullscreen-wrapper">
      <div className="top-bar">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="col-md-6 col-lg-4 p-4 border rounded shadow-sm bg-light">
          <h1 className="text-center mb-4 fw-bold text-primary">Sign In</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">User Name</label>
              <input
                className="form-control input-hover-effect"
                type="text"
                id="username"
                name="username"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                className="form-control input-hover-effect"
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Sign In</button>
            <a href="/signup" className="d-block text-center mt-3">Don't have an account? Sign Up now!</a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
