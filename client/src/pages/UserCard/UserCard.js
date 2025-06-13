
import React from "react";
import './UserCard.css';
import logo from '../../images/logo.png';
import { useState, useEffect } from "react";


function UserCard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or error fetching user");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="card user-card">Error: {error}</div>;
  if (!user) return <div className="card user-card">Loading...</div>;  

  return (
        <div className="card position-absolute top-100 end-0 card-style">
            <img src={user.img} className="card-img-top" alt="profile image" />
            <div className="card-body">
                <h5 className="card-title">Hi {user.firstName}</h5>
                <p className="card-text">
                    user name: {user.userName}
                </p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">{user.firstName} {user.lastName}</li>
                <li className="list-group-item">{user.gender}</li>
                <li className="list-group-item">{user.birthDate}</li>
            </ul>
        </div>
    );
}

export default UserCard;
