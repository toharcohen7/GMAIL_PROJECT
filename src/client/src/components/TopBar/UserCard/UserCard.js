import React from "react";
import './UserCard.css';

function UserCard({user}) {
  return (
        <div className="card position-absolute top-100 end-0 card-style">
            <img 
                src={user.image} 
                className="card-img-top rounded-circle object-fit-cover circile-adg" 
                alt={`${user.firstName} ${user.lastName}`} // Updated alt text
            />
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
