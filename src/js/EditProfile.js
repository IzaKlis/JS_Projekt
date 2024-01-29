import React, {useEffect, useState} from 'react';
import API from "./API";
import bcrypt from "bcryptjs";

const EditProfile = () => {
    const [about, setAbout] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [gender, setGender] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [birthdate, setBirthdate] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const userId = sessionStorage.getItem('userId');

    const fetchData = async () => {
        try {
            const response = await API.get("/users/" + userId);
            setUserData(response.data);
        } catch (error) {
            console.error('Error while fetching data', error);
        }
        const usersTmp = await API.get("/users");
        const idRelation = usersTmp.data.userRelationTo || [];

        const relationsTmp = await API.get("/users_relations");
        const currentUserRelations = relationsTmp.data.filter(relation => idRelation.includes(relation.status === "Friends"));

        console.log(currentUserRelations);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const setUserData = (data) => {
        setEmail(data.email);
        setFirstName(data.name);
        setLastName(data.surname);
        setAbout(data.about);
        setSelectedImage(data.picture);
        setBirthdate(data.birthdayDate);
        setGender(data.gender);
        setCurrentPassword(data.password);
    };

    const handleSave = async () => {
        try {
            const picturePath = selectedImage ? selectedImage : null;

            const requestBody = {
                email: email,
                about: about,
                picture: picturePath
            };

            const response = await API.patch("/users/" + userId, requestBody);
            if (response.status === 200) {
                setIsEditing(false);
                fetchData();
            } else {
                console.error('Failed to save data:', response.statusText);
            }
        } catch (error) {
            console.error('Error while saving data:', error);
        }
    };

    const handlePasswordChange = async () => {
        try {
            if (newPassword !== confirmPassword) {
                setErrorMessage("Passwords do not match");
                return;
            }
            const isCurrentPasswordValid = await bcrypt.compare(password, currentPassword);

            if(!isCurrentPasswordValid){
                setErrorMessage("Current password is incorrect");
                return;
            }

            const requestBody = {
                password: await bcrypt.hash(newPassword, 10),
            };

            const response = await API.patch("/users/" + userId, requestBody);
            if (response.status === 200) {
                setIsEditing(false);
            } else {
                console.error('Failed to save data:', response.statusText);
            }
        } catch (error) {
            console.error('Error while saving data:', error);
        }
    };

    const startEditing = () => {
        setIsEditing(true);
    };

    return (
        <div className="edit-profile-container">
            <h1>User Profile</h1>
            <button onClick={startEditing} disabled={isEditing}>
                Edit Profile
            </button>
            <h2>User data</h2>
            <form>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                />
                <label>Name:</label>
                <input
                    type="text"
                    value={firstName}
                    disabled
                />
                <label>Surname:</label>
                <input
                    type="text"
                    value={lastName}
                    disabled
                />
                <label>Birth date:</label>
                <input
                    type="text"
                    value={birthdate}
                    readOnly
                    disabled
                />
                <label>Gender:</label>
                <input
                    type="text"
                    value={gender}
                    disabled
                />

                <label>About:</label>
                <input
                    type="textarea"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    disabled={!isEditing}
                />
            </form>
            <form>
                <label>Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!isEditing}
                />
                <label>New password:</label>
                <input
                    type="password"
                    name="newpassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!isEditing}
                />
                <label>Confirm new password:</label>
                <input
                    type="password"
                    name="confirmpassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!isEditing}
                />
                <span>{errorMessage}</span>
            </form>
            <button disabled={!isEditing} onClick={handlePasswordChange}>
                Zmień hasło
            </button>
            <button disabled={!isEditing} onClick={handleSave}>
                Save
            </button>
            <button disabled={!isEditing} onClick={() => setIsEditing(false)}>
                Cancel
            </button>
        </div>
    )
        ;
};

export default EditProfile;