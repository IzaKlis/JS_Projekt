import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import API from "./API";

const User_Profile = () => {
    const [userData, setUserData] = useState(null);
    const { userId } = useParams();

    const fetchData = async (id) => {
        try {
            const response = await API.get(`/users/${id}`);
            setUserData(response.data);
        } catch (error) {
            console.error('Error while fetching data', error);
        }
    };

    useEffect(() => {
        // Check if userId is not provided as a URL parameter
        if (!userId) {
            // Retrieve userId from sessionStorage
            const storedUserId = sessionStorage.getItem("userId");

            // Check if storedUserId exists before fetching data
            if (storedUserId) {
                fetchData(storedUserId);
            } else {
                console.error('User ID not found in sessionStorage');
            }
        } else {
            // If userId is provided as a URL parameter, fetch data
            fetchData(userId);
        }
    }, [userId]);
    return (
        <div className="user-profile-container">
            <h1 className="user-profile-h1">User Profile</h1>
            <h2 className="user-profile-h2">User data</h2>
            {userData && (
                <div>
                    <div>
                        <label className="user-profile-label">Email:</label>
                        <span className="user-profile-span">{userData.email}</span>
                    </div>
                    <div>
                        <label className="user-profile-label">Name:</label>
                        <span className="user-profile-span">{userData.name}</span>
                    </div>
                    <div>
                        <label className="user-profile-label">Surname:</label>
                        <span className="user-profile-span">{userData.surname}</span>
                    </div>
                    <div>
                        <label className="user-profile-label">Birth date:</label>
                        <span className="user-profile-span">{userData.birthdayDate}</span>
                    </div>
                    <div>
                        <label className="user-profile-label">Gender:</label>
                        <span className="user-profile-span">{userData.gender}</span>
                    </div>
                    <div>
                        <label className="user-profile-label">About:</label>
                        <span className="user-profile-span">{userData.about}</span>
                    </div>
                </div>
            )}
            <div>
                <label className="user-profile-label">Profile picture:</label>
                {userData && (
                    <img className="user-profile-img" src={userData.picture} alt="Profile"/>
                )}
            </div>

            {!userId && (
                <div>
                    <Link to="/editProfile">
                        <button className="edit-profile-button">Edit Profile</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default User_Profile;
