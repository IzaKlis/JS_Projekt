import React, {useEffect, useState} from 'react';
import API from "./API";
import { useNavigate } from 'react-router-dom';

function AddPost() {
    const navigate = useNavigate();
    const [fileName, setFileName] = useState([])
    const [post, setPost] = useState({
        title: '',
        content: '',
        image: '',
        hashtagsId: '',
        hashtagsName: '',
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    function getRandomTravelWord() {
        const travelWords = ['sea','mountains','river','lake','jungle','desert','village','forest','North_Pole'];

        const randomIndex = Math.floor(Math.random() * travelWords.length);
        return travelWords[randomIndex];
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let userId = sessionStorage.getItem('userId');

        try {
            const response = await API.post("/posts", {
                title: post.title,
                body: post.content,
                dateCreated: new Date().toLocaleDateString(),
                id_user: userId,
                postComments: [],
                postLikeReactions: 0,
                postDislikeReactions: 0,
                postPictures: 'https://source.unsplash.com/800x200/?'+getRandomTravelWord(),
            });
            const postId = response.data.id;
            const userResponse = await API.get(`/users/${userId}`);

            await API.patch(`/users/${userId}`, {
                posts: [...userResponse.data.posts, postId],
            });

        } catch (error) {
            console.error('Error while creating a new post', error);
        }
        navigate("/")

    };


    return (
        <div className="add-post-container">
                <div>
                    <h3>Add Post</h3>
                    <form onSubmit={handleFormSubmit}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={post.title}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="textarea"
                            name="content"
                            placeholder="Content"
                            rows="4"
                            value={post.content}
                            onChange={handleInputChange}
                            required
                        />
                        {post.image && <img src={post.image} alt="Profile Picture"/>}
                        <button type="submit"> Add Post</button>
                    </form>
                </div>
        </div>
    );
}

export default AddPost;
