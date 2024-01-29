import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import API from "./API";

const User_Profile = () => {
    const [userData, setUserData] = useState(null);
    const {userId} = useParams();
    const [search, setSearch] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [isLoggedUser, setIsLoggedUser] = useState(false);

    useEffect(() => {
        if (!userId) {
            const storedUserId = sessionStorage.getItem("userId");
            if (storedUserId) {
                fetchData(storedUserId);
                setIsLoggedUser(true);
            } else {
                console.error('User ID not found in sessionStorage');
            }
        } else {
            fetchData(userId);
        }
    }, [userId]);

    const fetchData = async (id) => {
        try {
            const userResponse = await API.get(`/users/${id}`);
            setUserData(userResponse.data);

            const userPosts = userResponse.data.posts || [];

            const postsResponse = await API.get("/posts");
            const currentUserPosts = postsResponse.data.filter(post => userPosts.includes(post.id));
            setPosts(currentUserPosts);

        } catch (error) {
            console.error('Error while fetching data', error);
        }
    };

    const filteredPosts = posts.filter(post => {
        const lowerSearch = search.toLowerCase();
        return (post.title.toLowerCase().includes(lowerSearch) || post.body.toLowerCase().includes(lowerSearch) || findUserName(post.id_user).toLowerCase().includes(lowerSearch));
    });

    const handleDeletePost = async (postId,userId) => {
        try {
            await API.delete(`/posts/${postId}`);

            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));

            const updatedUserResponse = await API.get(`/users/${userId}`);
            const updatedUser = updatedUserResponse.data;

            const updatedUserPosts = updatedUser.posts.filter(userPostId => userPostId !== postId);
            updatedUser.posts = updatedUserPosts;

            await API.patch(`/users/${userId}`, { posts: updatedUser.posts });

        } catch (error) {
            console.error('Error while deleting post', error);
        }
    };

    const findUserName = (userId) => {
        const user = users.find((user) => user.id == userId);
        return user ? user.name + " " + user.surname : 'Unknown User';
    };


    return (
        <>
            <div className="user-profile-container">
                {userData && (

                    <div>
                        <div>
                            {userData && (
                                <img className="user-profile-img" src={userData.picture} alt="Profile"/>
                            )}
                        </div>
                        <div>
                            <span className="user-profile-name">{userData.name+" "+userData.surname}</span>
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
            </div>
            <div className="home-container">
                <h2>User posts:</h2>
                    {filteredPosts.map((post, index) => (<div key={post.id} className="home-post">
                        {isLoggedUser && (
                            <button className="delete-post-button" onClick={() => handleDeletePost(post.id,userData.id)}>
                                Delete Post
                            </button>
                        )}
                        <img className="user-profile-img" src={post.postPictures} alt="PostPicture"/>
                        <div>
                            <p className="home-post-title">{post.title}</p>
                            <Link className="home-post-author" to={"/profile/" + post.id_user}>
                                <p>{userData.name+" "+userData.surname}</p></Link>
                            <p>{post.dateCreated}</p>
                        </div>
                        <div className="home-post-body">
                            <p>{post.body}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

}
export default User_Profile;


