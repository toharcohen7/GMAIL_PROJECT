
// import "./signIn.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";


function SignIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await getToken(userName, password);
    }

  async function getToken (userName, password) {
    await fetch("http://localhost:12345/api/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid username or password");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Token received:", data);
        setIsLoggedIn(true);
        // Handle successful sign-in, e.g., store token, redirect, etc.
      })
      .catch((error) => {
        console.error("Error signing in:", error);
        alert(error.message);
      });
  }

if (isLoggedIn) {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-success">Hello {userName} 🎉</h2>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-4 p-4 border rounded shadow-sm bg-light">
        <h1 className="text-center mb-4 fw-bold text-primary">Sign In</h1>
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
        </form>
      </div>
    </div>
  );
}

export default SignIn;