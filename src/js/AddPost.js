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
                postPictures: fileName,
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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setFileName(file.name)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataURL = reader.result;
                setPost((prevPost) => ({
                    ...prevPost,
                    image: imageDataURL,
                }));
            };
            reader.readAsDataURL(file);
            
        }
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
                        <input
                            type="file"
                            name="image"
                            id="imageUpload"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e)}
                            style={{display: 'none'}}
                        />
                        <label htmlFor="imageUpload">
                            Add Picture
                        </label>
                        {post.image && <img src={post.image} alt="Profile Picture"/>}
                        <button type="submit"> Add Post</button>
                    </form>
                </div>
        </div>
    );
}

export default AddPost;
