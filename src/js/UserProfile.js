import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import API from "./API";

const User_Profile = () => {
    const [userData, setUserData] = useState(null);
    const {userId} = useParams();
    const [allUsers, setAllUsers] = useState([]);
    const [posts, setPosts] = useState([]);
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
                        {isLoggedUser && (
                            <button className="delete-post-button" onClick={() => handleDeletePost(post.id,userData.id)}>
                                Delete Post
                            </button>
                        )}
                        <img src={require(`../images/avatar.jpg` /* ${post.postPictures} */)} alt="logo" height={100}/>
                        <div>
                            <p className="home-post-title">{post.title}</p>
                                <p>{userData.name} {userData.surname}</p>
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


