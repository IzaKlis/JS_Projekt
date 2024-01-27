import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import API from "./API";

const User_Profile = () => {
    const [userData, setUserData] = useState(null);
    const {userId} = useParams();
    const [allUsers, setAllUsers] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!userId) {
            const storedUserId = sessionStorage.getItem("userId");
            if (storedUserId) {
                fetchData(storedUserId);
            } else {
                console.error('User ID not found in sessionStorage');
            }
        } else {
            fetchData(userId);
        }
    }, [userId]);

    const fetchData = async (id) => {
        try {
            const response = await API.get("/posts");
            const currentUserPosts = response.data.filter(post => post.id_user === userId);
            setPosts(currentUserPosts);
            console.log(currentUserPosts);
        } catch (error) {
            console.error('Error while fetching posts data', error);
        }
        try {
            const response = await API.get("/users");
            setAllUsers(response.data);
        } catch (error) {
            console.error('Error while fetching users data', error);
        }
        try {
            const response = await API.get(`/users/${id}`);
            setUserData(response.data);
        } catch (error) {
            console.error('Error while fetching data', error);
        }
    };

    const findUserName = (iduser) => {
        const user = allUsers.find((user) => user.id == userId);
        return user ? user.name + " " + user.surname : 'Unknown User';
    };

    return (
        <>
            <div className="user-profile-container">
                {userData && (
                    <div>
                        <h1 className="user-profile-h1">User Profile</h1>
                        <h2 className="user-profile-h2">User data</h2>
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
                        <div>
                            <label className="user-profile-label">Profile picture:</label>
                            {userData && (
                                <img className="user-profile-img" src={userData.picture} alt="Profile"/>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="home-container">
                {posts.map((post, index) => (
                    <div key={post.id} className="home-post">
                        {/* Display post information */}
                        <img src={require(`../images/avatar.jpg` /* ${post.postPictures} */)} alt="logo" height={100}/>
                        <div>
                            <p className="home-post-title">{post.title}</p>
                            <Link className="home-post-author" to={"/profile/" + post.id_user}>
                                <p>{findUserName(post.id_user)}</p>
                            </Link>
                        </div>
                        <div className="home-post-buttons">
                            <div>
                                <button className="home-like-button">
                                    Like ({post.postLikeReactions})
                                </button>
                                <button className="home-dislike-button">
                                    Dislike ({post.postDislikeReactions})
                                </button>
                                <div className="home-comment">
                                    <p>Pętla po komentarzach w bazie danych trzeba zrobić i zapisywanie treści
                                        komentarza i usera do db</p>
                                </div>
                                <form className="home-comment-form">
                                <textarea
                                    className={"home-comment-field"}
                                    placeholder={"Add your comment"}>
                                </textarea>
                                    <button type={"submit"} className="home-comment-button">
                                        Comment
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

}
export default User_Profile;


