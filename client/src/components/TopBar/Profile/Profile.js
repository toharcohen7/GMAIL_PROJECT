import React, { useState, useEffect } from "react";
import UserCard from "../UserCard/UserCard";

function Profile(){

    const [showCard, setShowCard] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    fetch("http://localhost:12345/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or error fetching user");
        console.log(res);
        return res.json();
      })
      .then((data) =>{
        setUser(data)
        localStorage.setItem("user-id", data.id);
    })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="card user-card">Error: {error}</div>;
  if (!user) return <div className="card user-card">Loading...</div>;  

    return (
        <div className="position-relative mx-1">
            <button onClick={() => setShowCard(prev => !prev)} className="btn btn-outline-secondary">
                <img src={user.image} className="rounded-circle object-fit-cover top-bar-img" alt="profile image"></img>
            </button>

            {showCard && (
                <div className="card user-card">
                    <UserCard user={user} />
                </div>
            )}
        </div>
    );
}

export default Profile;