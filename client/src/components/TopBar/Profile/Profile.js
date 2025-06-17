import React, { useState, useEffect } from "react";
import UserCard from "../UserCard/UserCard";
import { FetchWithAuth } from "../../FetchWithAuth/FetchWithAuth";

function Profile() {
  const [showCard, setShowCard] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await FetchWithAuth("http://localhost:12345/api/users/me");
        if (!res || !res.ok) throw new Error("Unauthorized or error fetching user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchUser();
  }, []);

  if (error) return <div className="card user-card">Error: {error}</div>;
  if (!user) return <div className="card user-card">Loading...</div>;

  return (
    <div className="position-relative mx-1">
      <button onClick={() => setShowCard(prev => !prev)} className="btn btn-outline-secondary">
        <img src={user.image} className="rounded-circle object-fit-cover top-bar-img" alt="" aria-hidden="true" />

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
